package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DbUser                    string
	DbPassword                string
	DbName                    string
	DbHost                    string
	DbPort                    string
	CertPath                  string
	Network                   string
	ChainId                   int
	SyncBaseUrl               string
	SyncMinHeight             int
	SyncFetchIntervalInBlocks int
	SyncAttemptsMaxRetry      int
	SyncAttemptsIntervalInMs  int
	IsDevelopment             bool
}

var config *Config

func InitEnv(envFilePath string) {
	IsDevelopment := true
	if err := godotenv.Load(envFilePath); err != nil {
		IsDevelopment = false
		log.Printf("No .env file found at %s, falling back to system environment variables", envFilePath)
	}

	config = &Config{
		DbUser:                    getEnv("DB_USERNAME"),
		DbPassword:                getEnv("DB_PASSWORD"),
		DbName:                    getEnv("DB_NAME"),
		DbHost:                    getEnv("DB_HOST"),
		DbPort:                    getEnv("DB_PORT"),
		CertPath:                  getEnv("CERT_PATH"),
		Network:                   getEnv("NETWORK"),
		ChainId:                   getEnvAsInt("CHAIN_ID"),
		SyncBaseUrl:               getEnv("SYNC_BASE_URL"),
		SyncMinHeight:             getEnvAsInt("SYNC_MIN_HEIGHT"),
		SyncFetchIntervalInBlocks: getEnvAsInt("SYNC_FETCH_INTERVAL_IN_BLOCKS"),
		SyncAttemptsMaxRetry:      getEnvAsInt("SYNC_ATTEMPTS_MAX_RETRY"),
		SyncAttemptsIntervalInMs:  getEnvAsInt("SYNC_ATTEMPTS_INTERVAL_IN_MS"),
		IsDevelopment:             IsDevelopment,
	}
}

func GetConfig() *Config {
	if config == nil {
		log.Fatal("Config not initialized. Call InitEnv first.")
	}
	return config
}

func getEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("Environment variable %s is required but not set", key)
	}
	return value
}

func getEnvAsInt(key string) int {
	valueStr := getEnv(key)
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		log.Fatalf("Environment variable %s must be an integer, but got: %s", key, valueStr)
	}
	return value
}
