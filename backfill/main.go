package main

import (
	"flag"
	"go-backfill/config"
	"go-backfill/fetch"
	"go-backfill/process"
)

func main() {
	envFile := flag.String("env", ".env", "Path to the .env file")
	flag.Parse()
	config.InitEnv(*envFile)
	env := config.GetConfig()

	pool := config.InitDatabase()
	defer pool.Close()

	go config.StartMemoryMonitoring()
	cut := fetch.FetchCut()
	ChainId := env.ChainId
	minHeights := config.GetMinHeights(env.Network)
	SyncMinHeight := minHeights[ChainId]
	process.StartBackfill(cut.Height, cut.Hash, ChainId, SyncMinHeight, pool)
}
