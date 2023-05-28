# Logging and Monitoring Setup with Prometheus, FluentD, Elasticsearch, Kibana, and Grafana

This guide provides instructions for setting up logging and monitoring for your Docker containers running on Kubernetes using Prometheus, FluentD, Elasticsearch, Kibana, and Grafana.

## Prerequisites

- A running Kubernetes cluster
- Docker installed
- Chaos Mesh installed (optional, for fault injection)

## Setup

### FluentD

1. Pull the FluentD image from Docker:

    ```bash
    docker pull fluent/fluentd
    ```

2. Run the FluentD Docker container:

    ```bash
    docker run -d -p 24224:24224 -v /path/to/your/fluentd.conf:/fluentd/etc/fluentd.conf fluent/fluentd
    ```

`fluentd.config`
```
<source>
    @type forward
    port 24224
</source>

<match **>
    @type stdout
</match>

```
### Prometheus

1. Install Prometheus to your Kubernetes cluster.

2. Configure Prometheus to monitor your services, Kubernetes, and Chaos Mesh using a `prometheus.yml` configuration file.

`prometheus.yml`

```
global:
  scrape_interval:     15s # scrape targets every 15 seconds.
  evaluation_interval: 15s # Evaluate rules every 15 seconds.

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
    - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
    - targets: ['localhost:9100']

```

### Elasticsearch and Kibana

1. Pull the Elasticsearch image from Docker:

    ```bash
    docker pull docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    ```

2. Run the Elasticsearch Docker container:

    ```bash
    docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    ```

3. Pull the Kibana image from Docker:

    ```bash
    docker pull docker.elastic.co/kibana/kibana:7.15.0
    ```

4. Run the Kibana Docker container:

    ```bash
    docker run -d --link elasticsearch:elasticsearch -p 5601:5601 docker.elastic.co/kibana/kibana:7.15.0
    ```

### Grafana

1. Pull the Grafana image from Docker:

    ```bash
    docker pull grafana/grafana
    ```

2. Run the Grafana Docker container:

    ```bash
    docker run -d -p 3000:3000 grafana/grafana
    ```

## Importing Data

1. FluentD will capture logs from your Docker containers and forward them to Elasticsearch.
2. Prometheus will collect metrics from your services, Kubernetes, and Chaos Mesh.
3. Use Kibana to visualize the log data stored in Elasticsearch.
4. Use Grafana to visualize the metrics data stored in Prometheus.


* Note: Make sure to replace /path/to/your/fluentd.conf with the actual path (absolute path) to your FluentD configuration file in the FluentD command. The above commands use example port numbers, so ensure that these ports are available and modify them as needed to fit your environment.