-- up:begin
create extension if not exists citext;

CREATE TABLE UserCredentials (
    id SERIAL,
    username CITEXT NOT NULL,
    password text NOT NULL,
    PRIMARY KEY (id)
);

-- up:end
-- down:begin
DROP TABLE UserCredentials;

drop extension citext;

-- down:end