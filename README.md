Node, JSON-Server, Node-mailer, Chokidar
Приложение работает в паре с  mock-shop_client  клиентская часть – галерея товаров / корзина товаров / страница заказа.
Сервер передает клиенту данные о товаре в виде массива объектов. В ответ, получает от клиента заказ в виде объекта + номер заказа + данные заказчика. 
Заказы сохраняются на локальном диске в виде массива заказов. 
Новый заказ в формате HTML сообщения отправляется на почтовый адрес условного менеджера для обработки заказа.

//Node, JSON-Server, Node-mailer, Chokidar
The application works in tandem with mock-shop_client client part - product gallery / shopping cart / order page.
The server sends product data to the client in the form of an array of objects. In response, receives an order from the client in the form of an object + order number + customer data. 
Orders are stored on the local disk in the form of an array of orders. 
A new order in the format of HTML message is sent to the mail address of the conditional manager for order processing.
