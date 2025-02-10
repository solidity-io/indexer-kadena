package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InitDatabase() *pgxpool.Pool {
	env := GetConfig()
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		env.DbHost, env.DbPort, env.DbUser, env.DbPassword, env.DbName)

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatalf("Unable to parse connection string: %v\n", err)
	}

	config.MaxConns = 2                        // Maximum number of connections
	config.MinConns = 1                        // Minimum number of connections to keep alive
	config.MaxConnLifetime = 1 * time.Hour     // Close and refresh connections after 1 hour
	config.HealthCheckPeriod = 1 * time.Minute // Check connection health every minute

	// Create the pool
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	return pool
}
