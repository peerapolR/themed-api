const config = require("../config/index");
const Order = require("../models/order");
const Coupon = require("../models/coupon");
const responseMessage = require("../utils/responseMessage");
const genCoupon = require("../utils/genCoupon");
// const genQRPayment = require("../utils/genQRPayment");

exports.admin = async (req, res, next) => {
  try {
    const {
      id,
      custName,
      productName,
      productQty,
      address,
      shipMethod,
      price,
      paymentMethod,
      slipImg,
    } = req.body;

    const textMessage = `รายการสิ้นค้าที่สั่งเข้ามา
    1. ชื่อลุกค้า : ${custName}
    2. ชื่อสินค้า : ${productName}
    3. จำนวน : ${productQty}
    4. ที่อยู่ : ${address}
    5. จัดส่งโดย : ${shipMethod}
    6. ยอดรวม : ${price} บาท
    7. ชำระเงินผ่านธนาคาร : ${paymentMethod}`;

    const textFirstResponse = {
      //Group Admin ID
      to: "C4e5cfd4400582672b3ba6d18991799e6",
      messages: [
        {
          type: "text",
          text: "Admin Message",
        },
        {
          type: "text",
          text: textMessage,
        },
        {
          type: "image",
          originalContentUrl: slipImg,
          previewImageUrl: slipImg,
        },
      ],
    };
    const decisionResponse = {
      //Group Admin ID
      to: "C4e5cfd4400582672b3ba6d18991799e6",
      messages: [
        {
          type: "flex",
          altText: "สินค้ารอการอนุมัติ",
          contents: {
            type: "bubble",
            header: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  size: "xl",
                  align: "center",
                  weight: "bold",
                  wrap: true,
                  text: `Order No.${id} Approve or not?`,
                },
              ],
            },
            // hero: {
            //   type: "image",
            //   url: slipImg,
            //   size: "full",
            //   aspectRatio: "2:1",
            // },
            // body: {
            //   type: "box",
            //   layout: "vertical",
            //   contents: [
            //     {
            //       type: "text",
            //       wrap: true,
            //       text: textMessage,
            //     },
            //   ],
            // },
            footer: {
              type: "box",
              layout: "horizontal",
              spacing: "md",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "message",
                    label: "APPROVE",
                    text: `Approve order of K.${custName} order ID : ${id}`,
                  },
                },
                {
                  type: "button",
                  style: "primary",
                  color: "#F90306",
                  action: {
                    type: "message",
                    label: "REJECT",
                    text: `Reject order of K.${custName} order ID : ${id}`,
                  },
                },
              ],
            },
          },
        },
      ],
    };

    const firstRes = await fetch(`https://api.line.me/v2/bot/message/push`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.LINE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(textFirstResponse),
    });
    const decisionRes = await fetch(`https://api.line.me/v2/bot/message/push`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.LINE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(decisionResponse),
    });

    return res.status(200).json({
      ...responseMessage.success,
    });
  } catch (error) {
    next(error);
  }
};

exports.messageHook = async (req, res, next) => {
  try {
    let hookMessage = req.body.events[0].message.text || null;
    let groupId = req.body.events[0].source.groupId || null;
    let data = "";
    if (hookMessage) {
      if (hookMessage.substring(0, 3) === "App") {
        let stringIndex = hookMessage.indexOf(":");
        let orderID = hookMessage
          .substring(stringIndex + 1, hookMessage.length)
          .trim();
        const existOrder = await Order.findOne({
          _id: orderID,
          // order_status: "pending",
        })
          .select("-createdAt -updatedAt -__v -isActive")
          .lean();
        const custId = existOrder.customer_id;
        if (!existOrder) {
          const textResponse = {
            to: custId,
            messages: [
              {
                type: "text",
                text: `Order : ${orderID} cannot approve.`,
              },
            ],
          };
          const res = await fetch(`https://api.line.me/v2/bot/message/push`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${config.LINE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(textResponse),
          });
        }

        //Update order status
        const updateOrder = await Order.updateOne(
          { _id: orderID },
          { order_status: "approve" }
        );
        if (updateOrder.nModified === 0) {
          throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
        }

        const textResponse = {
          to: custId,
          messages: [
            {
              type: "text",
              text: `Order ของคุณได้รับการยืนยันแล้ว ขนส่งกำลังจัดส่งสินค้า`,
            },
          ],
        };
        const res = await fetch(`https://api.line.me/v2/bot/message/push`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.LINE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(textResponse),
        });
      } else if (hookMessage.substring(0, 3) === "Rej") {
        let stringIndex = hookMessage.indexOf(":");
        let orderID = hookMessage
          .substring(stringIndex + 1, hookMessage.length)
          .trim();
        const existOrder = await Order.findOne({
          _id: orderID,
          // order_status: "pending",
        })
          .select("-createdAt -updatedAt -__v -isActive")
          .lean();

        const custId = existOrder.customer_id;
        if (!existOrder) {
          const textResponse = {
            to: custId,
            messages: [
              {
                type: "text",
                text: `Order : ${orderID} cannot reject.`,
              },
            ],
          };
          const res = await fetch(`https://api.line.me/v2/bot/message/push`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${config.LINE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(textResponse),
          });
        }

        const updateOrder = await Order.updateOne(
          { _id: orderID },
          { order_status: "reject" }
        );
        if (updateOrder.nModified === 0) {
          throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
        }

        const textResponse = {
          to: custId,
          messages: [
            {
              type: "text",
              text: "Order ของคุณถูกปฎิเสธกรุณาติดต่อเจ้าหน้าที่",
            },
          ],
        };
        const res = await fetch(`https://api.line.me/v2/bot/message/push`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.LINE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(textResponse),
        });
      } else if (
        hookMessage.substring(0, 6).toLowerCase() === "coupon" &&
        groupId === "C4e5cfd4400582672b3ba6d18991799e6"
      ) {
        try {
          let stringIndex = hookMessage.indexOf("-");
          let discountNum = hookMessage
            .substring(stringIndex + 1, hookMessage.length)
            .trim();

          if (discountNum) {
            let couponCode = await genCoupon(6);

            let coupon = new Coupon();
            coupon.coupon_name = `Special Discount ${discountNum}`;
            coupon.coupon_code = couponCode;
            coupon.discount_num = parseInt(discountNum);
            coupon.createdBy = "admin group";
            let resCoupon = await coupon.save();

            const textResponse = {
              to: "C4e5cfd4400582672b3ba6d18991799e6",
              messages: [
                {
                  type: "text",
                  text: `Coupon Code : ${resCoupon.coupon_code}`,
                },
              ],
            };
            const res = await fetch(`https://api.line.me/v2/bot/message/push`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${config.LINE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(textResponse),
            });

            data = await res.json();
          }
        } catch (err) {
          const textResponse = {
            to: "C4e5cfd4400582672b3ba6d18991799e6",
            messages: [
              {
                type: "text",
                text: "กรุณากรอกส่วนลดให้ถูกต้อง \n(Coupon - [จำนวนส่วนลด])\nEx. Coupon - 200",
              },
            ],
          };
          const res = await fetch(`https://api.line.me/v2/bot/message/push`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${config.LINE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(textResponse),
          });
        }
      }
    }
    return res.status(200).json({
      ...responseMessage.success,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
