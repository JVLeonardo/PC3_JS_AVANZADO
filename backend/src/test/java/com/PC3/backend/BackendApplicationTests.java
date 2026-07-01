package com.PC3.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.PC3.backend.pedido.PedidoRequest;
import com.PC3.backend.pedido.PedidoResponse;
import com.PC3.backend.pedido.PedidoService;
import com.PC3.backend.pedido.StockInsuficienteException;
import com.PC3.backend.producto.Producto;
import com.PC3.backend.producto.ProductoRepository;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private PedidoService pedidoService;

	@Autowired
	private ProductoRepository productoRepository;

	@Test
	void pedidoDescuentaStockYBloqueaCuandoNoAlcanza() {
		Producto producto = new Producto();
		producto.setNombre("Cafe de prueba");
		producto.setPrecio(java.math.BigDecimal.valueOf(5.50));
		producto.setStock(1);
		producto.setImagenUrl("https://example.com/cafe.jpg");
		Producto guardado = productoRepository.save(producto);

		PedidoResponse pedido = pedidoService.crear(new PedidoRequest(guardado.getId(), 1));

		assertEquals(0, pedido.stockRestante());
		assertThrows(
				StockInsuficienteException.class,
				() -> pedidoService.crear(new PedidoRequest(guardado.getId(), 1)));
	}

}
