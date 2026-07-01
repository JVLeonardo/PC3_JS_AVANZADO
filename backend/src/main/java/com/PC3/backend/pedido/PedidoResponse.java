package com.PC3.backend.pedido;

import java.time.OffsetDateTime;

public record PedidoResponse(
		Long id,
		Long productoId,
		int cantidad,
		int stockRestante,
		OffsetDateTime fechaRegistro) {
}
