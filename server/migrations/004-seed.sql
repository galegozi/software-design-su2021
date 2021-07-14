-- up:begin
insert into usercredentials (username, password)
values ('quannguyen', '$2b$10$i2aGJvwh4qPRL9VtJwQIY.EN9eEST/cM56vcpiSRsr9itFKXxRrX2'); --seeding with password: "password"
-- up:end
-- down:begin
delete from usercredentials where username='quannguyen';



-- down:end