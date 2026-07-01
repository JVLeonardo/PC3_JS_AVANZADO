package com.PC3.backend.pedido;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PedidoRequest(
		@NotNull Long productoId,
		@Min(1) int cantidad) {
}
