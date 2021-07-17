import DBClient from "../database/client";
import { Router } from "express";
import passport, { use } from "passport";
const prisma = DBClient.getInstance().prisma;

const router = Router();

router.post(
    '/quote',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const { id, username } = req.user as { username: string; id: number };

        const { gallon, deliveryDate } = req.body;
        console.log("Hello");
        console.log(req.body);

        //validation for galReq, loc, date
        if (!gallon || !deliveryDate) {
            return res.status(400).json({
                error: true,
                message: "Please fill all the fields\n" + gallon + "\n" + deliveryDate
            });
        }

        const currPrice = 1.5;

        try {
            var userinfo = await prisma.clientinformation.findFirst({
                where: { user_id: id }
            });
            if (!userinfo) {
                return res.status(400).json({
                    error: true,
                    message: "No client information has been supplied."
                });
            }

            try {
                var prevQuotes = await prisma.fuelquote.findFirst({
                    where: { user_id: id }
                });

                //todo: compute location factor
                var locFactor = userinfo.state != "TX" ? 0.04 : 0.02; //assume 4% because out of state. Need to do a lookup for instate locations.

                var histFactor = prevQuotes ? 0.01: 0.0 //assume 0% because no history. Need to do a lookup for history.

                var bigFactor = gallon > 1000 ? 0.02 : 0.03; //assume 0% because no big deal. Need to do a lookup for big deal.

                const profitFactor = 0.1; //assume 10% profit

                var margin = (locFactor - histFactor + bigFactor + profitFactor) * currPrice;
                var ppg = margin + currPrice;

                var totalPrice = ppg * gallon;

                var storedPrice = Math.ceil(totalPrice * 100);

                try {
                    const quote = await prisma.fuelquote.create({
                        data: {
                            usercredentials: { connect: { id } },
                            gallons: Number(gallon),
                            price_per_gallon: Math.ceil(ppg*100), 
                            delivery_date: new Date(deliveryDate),
                            delivery_address: userinfo.address,
                            delivery_city: userinfo.city,
                            delivery_state: userinfo.state,
                            delivery_zip: userinfo.zip,
                            delivery_address2: userinfo.address2
                        }
                    });
                    return res.status(200).json({error: false});
                }
                catch (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: true,
                        message: "Unable to create"
                    });
                }
                finally {}
            }
            finally {}
        }
        catch (e) {
            return res.status(500).json({
                error: true,
                message: "An error occurred while fetching the user"
            });
        }
    }
)

// router.get(
//     '/quoteinfo',
//     passport.authenticate('jwt', { session: false }),
//     async (req, res) => {
//         const { id, username } = req.user as { username: string; id: number };

//         try {
//             const quotes = await prisma.fuelquote.findMany({
//                 select: {
//                     galReq: "SUM(galReq)",
//                     ppg: "SUM(ppg)",
//                     date: "SUM(date)",

//                     address: "SUM(address)",
//                     city: "SUM(city)",
//                     state: "SUM(state)",
//                     zip: "SUM(zip)",
//                     address2: "SUM(address2)"
//                 },
//                 where: { user_id: id }
//             });

//             return res.status(200).json({
//                 quotes
//             });
//         }
//         catch (e) {
//             return res.status(500).json({
//                 error: true,
//                 message: "An error occurred while fetching the quotes"
//             });
//         }
//     }
// )

export default router;