import { createNanoEvents } from "nanoevents";

export interface ISocketData {
	method: string;
	id: string;
	payload: any;
	[x: string]: any;
}

/**
 * Кастомный класс для удобной работы с `WS` инстансом
 */
export class ClientSocket {
	emitter;
	socket: WebSocket;
	reconnect: boolean = true;
	id: string | false = false;
	token: string | false = false;
	url: string = "";
	protocols?: string | string[];
	user?: any;

	constructor(url?: string, protocols?: string | string[], reconnect?: boolean) {
		if (reconnect !== undefined) this.reconnect = !!reconnect;
		this.emitter = createNanoEvents();

		if (url) this.connect(url, protocols);
		this.emitter.on("connected", this.succesConnect);
	}

	/**
	 * Обработчик успешной авторизации
	 * @param {ISocketData} data
	 */
	succesConnect = (data: ISocketData) => {
		if (data.success) {
			this.id = data.id;
		} else {
			this.id = false;
		}
	};

	/**
	 * Метод для создания подключения `WS` с регистрацией кастомных обработчиков
	 * @param {string} url - ссылка для подключения
	 * @param {string | string[]} protocols - список протоколов как в стандартном `WS`
	 * @param {any} user - объект пользователя сформированный на сервере
	 */
	connect(url?: string, protocols?: string | string[], user?: any) {
		if (this.socket) this.socket.close();
		if (url) this.url = url;
		if (protocols) this.protocols = protocols;
		if (user) this.user = user;

		this.socket = new WebSocket(this.url, this.protocols);

		this.socket.onopen = this.onOpenHandler.bind(this);
		this.socket.onmessage = this.onMessageHandler.bind(this);
		this.socket.onerror = this.onErrorHandler.bind(this) as any;
		this.socket.onclose = this.onCloseHandler.bind(this);
	}

	/**
	 * Закрытие подключения `WS`
	 */
	disconnect() {
		if (this.socket) this.socket.close();
	}

	/**
	 * Кастомный метод отправки сообщения из `WS` на сервер с автоматическим форматированием
	 * @param {string} method - название события для удобной обработки на сервере
	 * @param {any} payload - необязательный параметр с данными которые нужно отправить на сервер
	 * @returns
	 */
	send(method: string, payload?: any) {
		if (!this.socket) return new Error("Socket is not found");
		if (this.socket.readyState !== this.socket.OPEN) return new Error("Socket is not opened");
		this.socket.send(JSON.stringify({ method, id: this.id, payload }));
	}

	/**
	 * Регистрация обработчика при событии
	 * @param {string} event - название события
	 * @param {any} callback - обработчик
	 * @returns Функцию отписки
	 * @example
	 * ws.on('ev', () => {});
	 * ----
	 * const unbind = ws.on('ev', () => {});
	 * disable () {
	 * 	unbind()
	 * }
	 */
	on(event: string, callback: any) {
		return this.emitter.on(event, callback);
	}

	/**
	 * Регистрация единоразового обработчика для события
	 * @param {string} event - название события
	 * @param {any} callback - обработчик
	 * @returns Функцию отписки
	 * @example
	 * ws.once('ev', () => {});
	 */
	once(event, callback) {
		const unbind = this.emitter.on(event, (...args) => {
			unbind();
			callback(...args);
		});
		return unbind;
	}

	/**
	 * Кастомный обработчик подключений к `WS` и вызов события в текущем инстансе класса
	 * @param {Event} ev
	 */
	private onOpenHandler(ev: Event) {
		if (this.socket) {
			this.socket.send(JSON.stringify({ method: "connection", payload: { user: this.user } }));
			this.emitter.emit("open", ev);
		}
	}

	/**
	 * Кастомный обработчик получения сообщений из `WS`, обработка и форматирование для кастомных событий
	 * @param {MessageEvent} ev - Стандартное событие сообщений
	 */
	private onMessageHandler(ev: MessageEvent) {
		try {
			const data = JSON.parse(ev.data);
			if (data.method) this.emitter.emit(data.method, data.payload);
		} finally {
			this.emitter.emit("message", ev);
		}
	}

	/**
	 * Кастомный обработчик ошибок в `WS`
	 * @param {ErrorEvent} err
	 */
	private onErrorHandler(err: ErrorEvent) {
		this.emitter.emit("error", err);
	}

	/**
	 * Кастомный обработчик закрытия `WS` и реализация функции переподключения
	 * @param {CloseEvent} ev
	 */
	private onCloseHandler(ev: CloseEvent) {
		this.emitter.emit("close", ev);
		if (this.reconnect && !ev.wasClean && this.id) {
			console.log("[WS]", "Reconnect...");
			setTimeout(() => this.connect(), 3000);
		}
	}
}

export const ws = new ClientSocket();
