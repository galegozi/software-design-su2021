import DBClient from '../database/client';
import { Router } from 'express';
import passport from 'passport';
import calculatePrice from '../pricing';

const prisma = DBClient.getInstance().prisma;

const router = Router();

router.post(
  '/quote',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user || !req.body?.gallon || !req.body?.deliveryDate) {
      return res.status(400).send({
        error: true,
        message: 'Gallons and delivery date are required.',
      });
    }
    if (
      !req.body.gallon ||
      Number(req.body.gallon) <= 0 ||
      !Number.isInteger(Number(req.body.gallon))
    ) {
      return res.status(400).send({
        error: true,
        message: 'Gallons must be a positive integer.',
      });
    }

    if (new Date(req.body.deliveryDate).toString() === 'Invalid Date') {
      return res.status(400).send({
        error: true,
        message: 'Delivery date is not a valid date.',
      });
    }

    const { id, username } = req.user as { username: string; id: number };

    const { gallon, deliveryDate, finalize } = req.body;

    try {
      var userinfo = await prisma.clientinformation.findFirst({
        where: { user_id: id },
      });
      if (!userinfo) {
        return res.status(400).json({
          error: true,
          message:
            'Information must be added to the profile before requesting quotes.',
        });
      }

      try {
        const prevQuotes = await prisma.fuelquote.findFirst({
          where: { user_id: id },
        });

        const hasPrevQuotes: boolean = !!prevQuotes;
        const state: string = userinfo.state;
        const gallons: number = req.body.gallon;

        const price = calculatePrice({
          hasPrevQuotes,
          state,
          gallons: gallons,
        });

        try {
          if (finalize) {
            const quote = await prisma.fuelquote.create({
              data: {
                usercredentials: { connect: { id } },
                gallons: Number(gallon),
                price_per_gallon: Math.ceil(price.ppg * 100),
                total_price: price.storedPrice,
                delivery_date: new Date(deliveryDate),
                delivery_address: userinfo.address,
                delivery_city: userinfo.city,
                delivery_state: userinfo.state,
                delivery_zip: userinfo.zip,
                delivery_address2: userinfo.address2,
              },
            });
          }
          return res.status(200).json({
            error: false,
            price: { totalPrice: price.storedPrice, ppg: price.ppg },
          });
        } catch (err) {
          console.error(err);
          return res.status(500).json({
            error: true,
            message: 'Unable to create',
          });
        } finally {
        }
      } finally {
      }
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'An error occurred while fetching the user',
      });
    }
  }
);

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
          total_price: true,
        },
        where: { user_id: id },
      });

      return res.status(200).json({
        quotes,
      });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: 'An error occurred while fetching the quotes',
      });
    }
  }
);

export default router;
