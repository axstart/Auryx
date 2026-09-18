export const cartEn = {
  title: "Your Cart",
  description: "Review and update items in your cart.",
  close: "Close cart",
  empty: "Your cart is empty.",
  browse: "Browse protocols →",
  autoAdded: "Auto-added — required for peptide preparation",
  consultationRequired: "Consultation required",
  removeAria: "Remove from cart",
  decreaseAria: "Decrease quantity",
  increaseAria: "Increase quantity",
  subtotal: "Subtotal",
  shippingNote: "Shipping calculated at checkout. All orders require physician review prior to fulfillment.",
  checkout: "Proceed to Checkout",
} as const;

export const cartEs = {
  title: "Su Carrito",
  description: "Revise y actualice los artículos de su carrito.",
  close: "Cerrar carrito",
  empty: "Su carrito está vacío.",
  browse: "Explorar protocolos →",
  autoAdded: "Agregado automáticamente — requerido para la preparación de péptidos",
  consultationRequired: "Consulta requerida",
  removeAria: "Eliminar del carrito",
  decreaseAria: "Disminuir cantidad",
  increaseAria: "Aumentar cantidad",
  subtotal: "Subtotal",
  shippingNote: "El envío se calcula en el checkout. Todos los pedidos requieren revisión médica antes del despacho.",
  checkout: "Ir al Checkout",
} as const;

export const cartPt = {
  title: "Seu Carrinho",
  description: "Revise e atualize os itens do seu carrinho.",
  close: "Fechar carrinho",
  empty: "Seu carrinho está vazio.",
  browse: "Explorar protocolos →",
  autoAdded: "Adicionado automaticamente — necessário para a preparação de peptídeos",
  consultationRequired: "Consulta necessária",
  removeAria: "Remover do carrinho",
  decreaseAria: "Diminuir quantidade",
  increaseAria: "Aumentar quantidade",
  subtotal: "Subtotal",
  shippingNote: "Frete calculado no checkout. Todos os pedidos exigem revisão médica antes do fulfillment.",
  checkout: "Ir para o Checkout",
} as const;

export type CartCopy = typeof cartEn;
