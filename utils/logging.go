package utils

import (
	"log"
	"os"
)

type aggregateLogger struct {
	infoLogger    *log.Logger
	warningLogger *log.Logger
	errorLogger   *log.Logger
}

func (l *aggregateLogger) Info(format string, v ...any) {
	l.infoLogger.Printf(format, v...)
}

func (l *aggregateLogger) Warning(format string, v ...any) {
	l.warningLogger.Printf(format, v...)
}

func (l *aggregateLogger) Error(format string, v ...any) {
	l.errorLogger.Printf(format, v...)
}

func (l *aggregateLogger) Fatal(v ...any) {
	l.errorLogger.Fatal(v...)
}

var Logger aggregateLogger

func init() {
	Logger = aggregateLogger{
		infoLogger:    log.New(os.Stdout, "INFO: ", log.LstdFlags),
		warningLogger: log.New(os.Stdout, "WARNING: ", log.LstdFlags),
		errorLogger:   log.New(os.Stdout, "ERROR: ", log.LstdFlags),
	}
}
