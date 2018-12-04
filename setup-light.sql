CREATE TABLE "light_sensor" (
    "id" integer NOT NULL,
    "value" integer NOT NULL,
    "timestamp" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);