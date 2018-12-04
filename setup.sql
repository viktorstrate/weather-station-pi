CREATE TABLE "light_sensor" (
    "id" integer NOT NULL,
    "value" integer NOT NULL,
    "timestamp" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)

CREATE TABLE "temperature_sensor" (
    "id" integer NOT NULL,
    "value" integer NOT NULL,
    "timestamp" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)