import DBClient from "../database/client";
import { Router } from "express";
import passport from "passport";
const prisma = DBClient.getInstance().prisma;

const router = Router();

router.post(
    '/quote',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const { id, username } = req.user as { username: string; id: number };

        const { galReq, loc, date } = req.body;

        //validation for galReq, loc, date
        if (!galReq || !loc || !date) {
            return res.status(400).json({
                error: true,
                message: "Please fill all the fields"
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

                var bigFactor = galReq > 1000 ? 0.02 : 0.03; //assume 0% because no big deal. Need to do a lookup for big deal.

                const profitFactor = 0.1; //assume 10% profit

                var margin = (locFactor - histFactor + bigFactor + profitFactor) * currPrice;
                var ppg = margin + currPrice;

                var totalPrice = ppg * galReq;

                var storedPrice = Math.ceil(totalPrice * 100);

                try {
                    const quote = await prisma.fuelquote.create({
                        data: {
                            usercredentials: { connect: { id } },
                            galReq,
                            ppg,
                            date,
                            address,
                            city,
                            state,
                            zip,
                            address2
                        }
                    });
                    return res.status(200);
                }
                catch (err) {
                    return res.status(500).json({
                        error: true,
                        message: "Something went wrong"
                    });
                }
            }
        }
        catch (e) {
            return res.status(500).json({
                error: true,
                message: "An error occurred while fetching the user"
            });
        }
    }
)