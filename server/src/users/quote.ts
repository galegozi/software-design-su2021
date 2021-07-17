import DBClient from "../database/client";
import { Router } from "express";
import passport, { use } from "passport";
const prisma = DBClient.getInstance().prisma;

const router = Router();

router.post(
    '/quote',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        if( !req || !req.user || !req.body || !req.body.gallon || !req.body.deliveryDate ) {
            res.status(400).send({
                error: true,
                message: "A username and a body with gallons and delivery date are required."
            });
        }

        if( !Number(req.body.gallon) || req.body.gallon < 0 || !Number.isInteger(req.body.gallon) ) {
            res.status(400).send({
                error: true,
                message: "Gallons must be a positive integer."
            });
        }

        if( !new Date(req.body.deliveryDate) ) {
            res.status(400).send({
                error: true,
                message: "Delivery date is not a valid date."
            });
        }

        const { id, username } = req.user as { username: string; id: number };

        const { gallon, deliveryDate } = req.body;

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
                var locFactor = userinfo.state != "TX" ? 0.04 : 0.02;

                var histFactor = prevQuotes ? 0.01: 0.0

                var bigFactor = gallon > 1000 ? 0.02 : 0.03;

                const profitFactor = 0.1;

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
                            total_price: storedPrice, 
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

router.get(
    '/quoteinfo',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const { id, username } = req.user as { username: string; id: number };

        try {
            const quotes = await prisma.fuelquote.findMany({
                select: {
                    id: true,
                    quote_date: true,
                    gallons: true,
                    delivery_date: true,
                    price_per_gallon: true,
                    total_price: true
                },
                where: { user_id: id }
            });

            return res.status(200).json({
                quotes
            });
        }
        catch (e) {
            return res.status(500).json({
                error: true,
                message: "An error occurred while fetching the quotes"
            });
        }
    }
)

export default router;