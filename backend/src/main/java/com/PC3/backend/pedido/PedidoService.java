package com.PC3.backend.pedido;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.PC3.backend.producto.Producto;
import com.PC3.backend.producto.ProductoRepository;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PedidoService {

	private final ProductoRepository productoRepository;
	private final PedidoRepository pedidoRepository;

	public PedidoService(ProductoRepository productoRepository, PedidoRepository pedidoRepository) {
		this.productoRepository = productoRepository;
		this.pedidoRepository = pedidoRepository;
	}

	@Transactional
	public PedidoResponse crear(PedidoRequest request) {
		Producto producto = productoRepository.findByIdForUpdate(request.productoId())
				.orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Producto no encontrado"));

		if (producto.getStock() < request.cantidad()) {
			throw new StockInsuficienteException("No hay stock suficiente para este producto");
		}

		producto.setStock(producto.getStock() - request.cantidad());

		Pedido pedido = new Pedido();
		pedido.setProducto(producto);
		pedido.setCantidad(request.cantidad());
		Pedido guardado = pedidoRepository.save(pedido);

		return new PedidoResponse(
				guardado.getId(),
				producto.getId(),
				guardado.getCantidad(),
				producto.getStock(),
				guardado.getFechaRegistro());
	}
}
