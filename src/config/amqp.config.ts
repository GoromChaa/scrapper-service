const exchanges: ExchangeConfig[] = [];

const queues: QueueConfig[] = [];

const bindings: BindingConfig[] = [];

const amqpConfig = {
  EXCHANGES: exchanges,
  QUEUES: queues,
  BINDINGS: bindings,
};

export default amqpConfig;
