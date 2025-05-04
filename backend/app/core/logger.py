# backend/app/core/logger.py

import logging

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(name)s: %(message)s")
    handler.setFormatter(formatter)

    if not logger.handlers:  # 避免重複添加 handler
        logger.addHandler(handler)

    return logger
