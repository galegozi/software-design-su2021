-- up:begin
CREATE TABLE ClientInformation (
    id SERIAL,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(9) NOT NULL,
    address2 VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES UserCredentials (id) ON DELETE cascade
);

-- up:end
-- down:begin
DROP TABLE ClientInformation;

-- down:end