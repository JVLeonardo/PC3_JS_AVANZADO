package com.PC3.backend.pedido;

public class StockInsuficienteException extends RuntimeException {

	public StockInsuficienteException(String message) {
		super(message);
	}
}
