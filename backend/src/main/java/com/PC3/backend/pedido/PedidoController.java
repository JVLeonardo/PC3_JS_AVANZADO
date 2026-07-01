package com.PC3.backend.pedido;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

	private final PedidoService pedidoService;

	public PedidoController(PedidoService pedidoService) {
		this.pedidoService = pedidoService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public PedidoResponse crear(@Valid @RequestBody PedidoRequest request) {
		return pedidoService.crear(request);
	}

	@ExceptionHandler(StockInsuficienteException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public Map<String, String> manejarStockInsuficiente(StockInsuficienteException exception) {
		return Map.of("message", exception.getMessage());
	}
}
