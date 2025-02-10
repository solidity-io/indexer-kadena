package config

import (
	"log"
	"runtime"
	"time"
)

func StartMemoryMonitoring() {
	var memStats runtime.MemStats
	for {
		runtime.ReadMemStats(&memStats)

		log.Printf(
			"Alloc: %v KB, Sys: %v KB, HeapIdle: %v KB, HeapInuse: %v KB, NumGC: %v\n",
			memStats.Alloc/1024,     // Total allocated memory
			memStats.Sys/1024,       // Total system memory requested
			memStats.HeapIdle/1024,  // Idle heap memory
			memStats.HeapInuse/1024, // In-use heap memory
			memStats.NumGC,          // Number of garbage collections
		)

		time.Sleep(10 * time.Second)
	}
}
