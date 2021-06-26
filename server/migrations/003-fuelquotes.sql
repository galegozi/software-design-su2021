-- up:begin
-- we will store the price in cents, so we use integer
CREATE TABLE FuelQuote (
    id SERIAL,
    user_id INTEGER NOT NULL,
    gallons INTEGER NOT NULL,
    price_per_gallon INTEGER NOT NULL,
    delivery_date date not null,
    delivery_address VARCHAR(100) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(2) NOT NULL,
    delivery_zip VARCHAR(9) NOT NULL,
    delivery_address2 VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES UserCredentials (id) ON DELETE CASCADE
);

-- up:end
-- down:begin
DROP TABLE FuelQuote;

-- down:end