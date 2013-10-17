<?php
/**
 * HttpClient.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * This class wrapps in the HTTP Request and adds various useful options.
 *
 * @package MOXMAN_Http
 */
class MOXMAN_Http_HttpClient {
	/** @ignore */
	private $isSSL, $host, $port, $socket, $readTimeout, $bufferSize, $logLevel, $logFunction, $inputStream, $outputStream;

	/**
	 * Constructs a new HttpClient instance.
	 *
	 * @param string $host HTTP host name to connect to or URL string to grab host and port from.
	 * @param int $port Port number
	 */
	public function __construct($host, $port = 80) {
		$url = parse_url($host);
		$this->isSSL = isset($url["scheme"]) && $url["scheme"] === "https";
		$this->host = isset($url["host"]) ? $url["host"] : $host;
		$this->port = isset($url["port"]) ? $url["port"] : ($this->isSSL ? ($port != 80 ? $port : 443) : $port);
		$this->readTimeout = 10;
		$this->bufferSize = 16384;
		$this->logLevel = 0;
	}

	/**
	 * Creates a new HTTP request instance for the specified path.
	 *
	 * @param string $path Path to create request instance for.
	 * @param string $method Method to send.
	 * @return MOXMAN_Http_HttpClientRequest HTTP request instance to create.
	 */
	public function createRequest($path, $method = "get") {
		$url = parse_url($path);

		// Set scheme, host and port to the specified one for the whole client
		$url["scheme"] = $this->isSSL ? "https" : "http";
		$url["host"] = $this->host;
		$url["port"] = $this->port;

		return new MOXMAN_Http_HttpClientRequest($this, $url, $method);
	}

	/**
	 * Creates a new http form data instance.
	 *
	 * @return MOXMAN_Http_HttpClientFormData Http form data instance to be send to client.
	 */
	public function createFormData() {
		return new MOXMAN_Http_HttpClientFormData();
	}

	/**
	 * Returns the buffer size in bytes.
	 *
	 * @return Int Number of bytes to buffer.
	 */
	public function getBufferSize() {
		return $this->bufferSize;
	}

	/**
	 * Sets the log function to be called.
	 *
	 * @param mixed $func Name of function or array with instance and method name.
	 */
	public function setLogFunction($func) {
		$this->logFunction = $func;
	}

	/**
	 * Returns the current log level. 0 = no logging, 1 = basic logging, 2 = verbose logging.
	 *
	 * @return int Current log level.
	 */
	public function getLogLevel() {
		return $this->logLevel;
	}

	/**
	 * Sets the current log level. 0 = no logging, 1 = basic logging, 2 = verbose logging.
	 *
	 * @param $level int Current log level.
	 */
	public function setLogLevel($level) {
		$this->logLevel = $level;
	}

	/**
	 * Logs the specified string to log function if the level is grater than 0.
	 *
	 * @param string $str This is a description
	 */
	public function log($str) {
		// @codeCoverageIgnoreStart

		if ($this->logLevel > 0) {
			if (!$this->logFunction) {
				echo nl2br(trim($str) . "\n");
			} else {
				if (is_array($this->logFunction)) {
					// Call user function in class reference
					$class = $this->logFunction[0];
					$name = $this->logFunction[1];
					$func = $class->$name($str);
				} else {
					$func = $this->logFunction;
					$func($str);
				}
			}
		}

		// @codeCoverageIgnoreEnd
	}

	// @codeCoverageIgnoreStart

	/**
	 * Sets the input stream resource handle.
	 *
	 * @param Resource $handle Resource handle to read data from.
	 */
	public function setInputStream($handle) {
		$this->inputStream = $handle;
	}

	/**
	 * Sets the output stream resource handle.
	 *
	 * @param resource $handle Resource handle to write data to.
	 */
	public function setOutputStream($handle) {
		$this->outputStream = $handle;
	}

	/**
	 * Returns the input stream that the HTTP client reads data from.
	 *
	 * @return resource Resource handle to input stream.
	 */
	public function getInputStream() {
		return $this->inputStream ? $this->inputStream : $this->getSocketStream();
	}

	/**
	 * Returns the output stream that the HTTP client writes data to.
	 *
	 * @return Resource Resource handle to output stream.
	 */
	public function getOutputStream() {
		return $this->outputStream ? $this->outputStream : $this->getSocketStream();
	}

	/**
	 * Closes the internal socket for the HTTP client.
	 */
	public function close() {
		if (is_resource($this->socket)) {
			fclose($this->socket);
			$this->socket = 0;
		}
	}

	/**
	 * Returns the clients internal socket resource.
	 *
	 * @return resource Resource for internal socket.
	 */
	public function getSocketStream() {
		// Open the socket if needed
		if (!is_resource($this->socket)) {
			$errno = $errstr = 0;

			// Open SSL or normal socket
			if ($this->isSSL) {
				$this->socket = fsockopen("ssl://" . $this->host, $this->port, $errno, $errstr, 5);
			} else {
				$this->socket = fsockopen($this->host, $this->port, $errno, $errstr, 5);
			}

			// Socket connection failed
			if ($this->socket === false) {
				throw new MOXMAN_Http_HttpClientException(
					"Failed to open socket connection to: " .
					$this->host . ":" . $this->port .
					". Err: [" . $errno . "] " . $errstr
				);
			}

			// Set socket read timeout
			stream_set_timeout($this->socket, $this->readTimeout);
		}

		return $this->socket;
	}

	/**
	 * Returns the read data timeout.
	 *
	 * @return int Read timeout.
	 */
	public function getReadTimeout() {
		return $this->readTimeout;
	}

	// @codeCoverageIgnoreEnd
}

/**
 * This class represents the HTTP request from a MOXMAN_Http_HttpClient instance.
 *
 * @package MOXMAN_Http
 */
class MOXMAN_Http_HttpClientRequest {
	/** @ignore */
	private $client, $url, $method, $headers, $localFilePath, $curlContentLength, $isLastCurlResponse;

	/**
	 * Constructs a new HTTP client request instance.
	 *
	 * @param MOXMAN_Http_HttpClient $client HTTP client instance to connect to request.
	 * @param Array $url Url object that contains the host, port, path, querystring etc.
	 * @param string $method Request method head/get/post.
	 */
	public function __construct($client, $url, $method) {
		$this->client = $client;
		$this->url = $url;
		$this->method = strtolower($method);
		$this->headers = array();
		$this->multipartCount = 0;

		// Set host as a HTTP header
		$this->setHeader("host", $url["host"]);
	}

	/**
	 * Returns the request method like get/post/head etc.
	 *
	 * @return String Http request method.
	 */
	public function getMethod() {
		return $this->method;
	}

	/**
	 * Sets a specific header by name to be sent to the server.
	 *
	 * @param string $name Name of the specified header to set.
	 * @param String/Array $value Value or multiple values if multiple headers of the same name is to be sent.
	 */
	public function setHeader($name, $value) {
		$this->headers[$name] = $value;
	}

	/**
	 * Returns a specific header by name to be sent to the server.
	 *
	 * @param string $name Name of the specified header to get.
	 * @param String/Array [$default] Default value to return if it's not set.
	 * @return String/Array $value Value or multiple values if multiple headers of the same name is to be sent.
	 */
	public function getHeader($name, $default = "") {
		if (!isset($this->headers[$name])) {
			return $default;
		}

		return $this->headers[$name];
	}

	/**
	 * Returns all http headers as an array.
	 *
	 * @return Array name/value array with all HTTP headers.
	 */
	public function getHeaders() {
		return $this->headers;
	}

	/**
	 * Returns the URL instance containing path, host, query etc.
	 *
	 * @return Array Name/value array with url items.
	 */
	public function getUrl() {
		return $this->url;
	}

	/**
	 * Sets the query string to a raw string or a name/value array.
	 *
	 * @param String/Array $query Query string or array to set.
	 * @return Instance of http request.
	 */
	public function setQuery($query) {
		if (is_array($query)) {
			$query = http_build_query($query);
		}

		$this->url["query"] = $query;

		return $this;
	}

	/**
	 * Sets a local file path to stream as content body of request.
	 *
	 * @param string $localFilePath Local file path to send as binary stream.
	 */
	public function setLocalFile($localFilePath) {
		$this->localFilePath = $localFilePath;
	}

	/**
	 * Sends the specified HTTP request to server and returns a HTTP response object.
	 *
	 * @param String/Array/MOXMAN_Http_HttpClientFormData Data to send to url like the request body or post parameters.
	 * @return MOXMAN_Http_HttpClientResponse HTTP client response instance.
	 */
	public function send($data = null) {
		if ($data instanceof MOXMAN_Http_HttpClientFormData && !$data->hasFileData()) {
			$data = $data->getItems();
		}

		if ($this->method == "get") {
			$query = array();

			if (isset($this->url["query"])) {
				parse_str($this->url["query"], $query);
			}

			if ($data) {
				foreach ($data as $key => $value) {
					$query[$key] = $value;
				}
			}

			$this->url["query"] = http_build_query($query);
		}

		if (function_exists('fsockopen')) {
			return $this->sendSocket($data);
		} else if (function_exists('curl_init')) {
			return $this->sendCurl($data);
		} else {
			throw new MOXMAN_Http_HttpClientResponse("Could not make HTTP request: No curl, no sockets in PHP.");
		}
	}

	private function sendCurl($data) {
		$this->curlContentLength = 0;
		$this->client->setInputStream(fopen('php://temp', "w+"));

		$url = $this->url;
		$url = $url["scheme"] . '://' . $url["host"] . $url["path"] . (isset($url["query"]) && $url["query"] ? '?' . $url["query"] : '');

		$ch = curl_init();
		curl_setopt_array($ch, array(
			CURLOPT_HEADERFUNCTION => array($this, 'curlCallbackWriteHeader'),
			CURLOPT_WRITEFUNCTION  => array($this, 'curlCallbackWriteBody'),
			CURLOPT_BUFFERSIZE     => $this->client->getBufferSize(),
			CURLOPT_CONNECTTIMEOUT => $this->client->getReadTimeout(),
			CURLINFO_HEADER_OUT    => true,
			CURLOPT_URL            => $url,
			CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
			CURLOPT_SSL_VERIFYHOST => 0,
			CURLOPT_SSL_VERIFYPEER => 0,
			CURLOPT_TIMEOUT        => $this->client->getReadTimeout()
		));

		//curl_setopt($ch, CURLOPT_PROXY, "localhost:8888");

		switch ($this->method) {
			case "get":
				curl_setopt($ch, CURLOPT_HTTPGET, true);
				break;

			case "post":
				curl_setopt($ch, CURLOPT_POST, true);

				// TODO: Implement this properly
				if ($data instanceof MOXMAN_Http_HttpClientFormData) {
					$postData = array();

					foreach ($data->getItems() as $item) {
						$postData[] = $item;
					}

					curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
				} else {
					curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
				}

				break;

			case "put":
				curl_setopt($ch, CURLOPT_UPLOAD, true);

				if (is_string($data)) {
					$fp = fopen('php://temp', "w+");
					fwrite($fp, $data);
					rewind($fp);

					curl_setopt($ch, CURLOPT_INFILE, $fp);
					curl_setopt($ch, CURLOPT_INFILESIZE, strlen($data));
				}

				break;

			case "head":
				curl_setopt($ch, CURLOPT_NOBODY, true);
				break;

			default:
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($this->method));
		}

		if ($this->localFilePath) {
			curl_setopt($ch, CURLOPT_INFILE, fopen($this->localFilePath, 'rb'));
			curl_setopt($ch, CURLOPT_INFILESIZE, filesize($this->localFilePath));
		}

		// Remove 100 expect header from request
		if (!$this->getHeader("Expect")) {
			$this->setHeader("Expect", "");
		}

		$headers = array();
		foreach ($this->headers as $key => $value) {
			$headers[] = $key . ':' . $value;
		}

		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		if (curl_exec($ch) === false) {
			throw new MOXMAN_Http_HttpClientException('Curl error: ' . curl_error($ch));
		}

		curl_close($ch);

		rewind($this->client->getInputStream());

		return new MOXMAN_Http_HttpClientResponse($this->client, $this, $this->curlContentLength);
	}

	private function curlCallbackWriteHeader($ch, $string) {
		// Auth and continue requests will produce multiple header chunks
		if (preg_match('!^(?:HTTP/(\d\.\d)) (\d{3})(?: (.+))?!', $string, $matches)) {
			if ($matches[2] >= 200) {
				$this->isLastCurlResponse = true;
			}
		}

		// Only add headers to stream if we are in the last response headers chunk
		if ($this->isLastCurlResponse) {
			fputs($this->client->getInputStream(), $string);
		}

		return strlen($string);
	}

	private function curlCallbackWriteBody($ch, $string) {
		$len = strlen($string);

		if ($this->isLastCurlResponse) {
			$this->curlContentLength .= $len;
			fputs($this->client->getInputStream(), $string);
		}

		return $len;
	}

	private function sendSocket($data) {
		$multipartChunks = null;
		$query = isset($this->url["query"]) ? $this->url["query"] : "";

		// If local file
		if ($this->localFilePath) {
			if ($this->getHeader("Content-Disposition", false) === false) {
				$this->setHeader("Content-Disposition", 'attachment; filename="' . basename($this->localFilePath) . '"');
			}

			$this->setHeader("Content-Length", filesize($this->localFilePath));
		}

		// Handle request data
		if ($data !== null) {
			if ($data instanceof MOXMAN_Http_HttpClientFormData) {
				$multipartChunks = $this->prepareMultipartRequest($data);
			}

			// If http post then build the data
			if ($this->method == "post") {
				if (is_array($data)) {
					$data = http_build_query($data);
					$this->setHeader("Content-Type", "application/x-www-form-urlencoded");
					$this->setHeader("Content-Length", strlen($data));
				}
			}
		}

		// Debug request URL
		if ($this->client->getLogLevel() >= 1) {
			$this->client->log("HTTP: (" . strtoupper($this->method) . ") " . $this->url["path"] . ($query ? "?" . $query : ""));
		}

		// Setup base of request
		$this->fputs(strtoupper($this->method) . " " . $this->url["path"] . ($query ? "?" . $query : "") . " HTTP/1.1\n");

		// Add headers
		foreach ($this->headers as $key => $value) {
			// If header has multiple values
			if (is_array($value)) {
				foreach ($value as $key2 => $value2) {
					if (strlen($value2)) {
						$this->fputs($key . ": " . $value2 . "\n");
					}
				}
			} else {
				if (strlen($value)) {
					$this->fputs($key . ": " . $value . "\n");
				}
			}
		}

		// Send request to client
		$this->fputs("\n");

		// Stream local file
		if ($this->method == "put" && $data === null && $this->localFilePath) {
			if ($this->client->getLogLevel() >= 2) {
				$this->client->log("> Stream local file: " . $this->localFilePath);
			}

			$fp = fopen($this->localFilePath, "rb");
			$bufferSize = $this->client->getBufferSize();
			$outputStream = $this->client->getOutputStream();

			while (($data = fread($fp, $bufferSize)) !== "") {
				fputs($outputStream, $data);
				$this->checkWriteTimeout();
			}

			fclose($fp);
		}

		// Send multipart request data or just normal form data
		if (($this->method == "post" || $this->method == "put") && $data !== null) {
			if ($multipartChunks) {
				$this->sendMultipartContent($multipartChunks);
			} else if (!is_array($data)) {
				$this->fputs($data, true);
			}
		}

		return new MOXMAN_Http_HttpClientResponse($this->client, $this);
	}

	/**
	 * Prepares a multipart request this will calculate the content-length of the request and setup and array with
	 * strings and item references to be used later on in the acutal request.
	 *
	 * @private
	 * @param MOXMAN_Http_HttpClientFormData $data Form data to send.
	 * @return Array Chunks to send.
	 */
	private function prepareMultipartRequest($data) {
		$chunks = array();
		$contentLength = 0;
		$boundary = "----moxiehttpclientboundary";

		$items = $data->getItems();
		foreach ($items as $name => $item) {
			if (is_string($item)) {
				// Normal name/value field
				$chunk = "--" . $boundary . "\n";
				$chunk .= "Content-Disposition: form-data; name=\"" . $name . "\"\n\n";
				$chunk .= $item . "\n";

				// Add chunk and increase length
				$contentLength += strlen($chunk);
				$chunks[] = $chunk;
			} else {
				if (!file_exists($item[0])) {
					throw new MOXMAN_Http_HttpClientException("Could not open file: " . $item[0] . " for upload using multipart.");
				}

				// File/stream field
				$chunk = "--" . $boundary . "\n";
				$chunk .= "Content-Disposition: form-data; name=\"" . $name . "\"; filename=\"" . rawurlencode($item[1]) . "\"\n";
				$chunk .= "Content-Type: " . $item[2] . "\n\n";

				// Add before chunk
				$contentLength += strlen($chunk);
				$chunks[] = $chunk;

				// Add blob and use the blob size
				$contentLength += filesize($item[0]);
				$chunks[] = $item;

				// Add after chunk
				$chunk = "\n--" . $boundary . "--\n";
				$contentLength += strlen($chunk);
				$chunks[] = $chunk;
			}
		}

		// Set content type, boundary and length
		$this->setHeader("Content-Type", "multipart/form-data; boundary=" . $boundary);
		$this->setHeader("Content-Length", $contentLength);

		return $chunks;
	}

	/**
	 * Sends the multipart chunk array to the server.
	 *
	 * @param Array $chunks Chunks to send to server.
	 */
	private function sendMultipartContent($chunks) {
		$bufferSize = $this->client->getBufferSize();

		for ($i = 0, $l = count($chunks); $i < $l; $i++) {
			$chunk = $chunks[$i];

			if (is_array($chunk)) {
				// Read file and send it chunk by chunk
				$fp = fopen($chunk[0], "rb");
				if ($fp) {
					while (!feof($fp)) {
						$this->fputs(fread($fp, $bufferSize), true);
					}

					fclose($fp);
				}
			} else {
				// Output simple text chunk
				$this->fputs($chunk, true);
			}
		}
	}

	/**
	 * Checks if the last socket write operation timed out if it has then it throws and exception.
	 */
	private function checkWriteTimeout() {
		$info = stream_get_meta_data($this->client->getOutputStream());

		if (isset($info['timed_out']) && $info['timed_out']) {
			// @codeCoverageIgnoreStart
			throw new MOXMAN_Http_HttpClientException("Request timed out.");
			// @codeCoverageIgnoreEnd
		}
	}

	/**
	 * Sends the specified data to server.
	 *
	 * @param string $data Data to send to client.
	 * @param boolean $isBody Is header or body content.
	 */
	private function fputs($data, $isBody = false) {
		if ($this->client->getLogLevel() >= 3) {
			$this->client->log("> " . trim($data));
		} else if ($this->client->getLogLevel() == 2 && !$isBody) {
			$this->client->log("> " . trim($data));
		}

		fputs($this->client->getOutputStream(), $data);
		$this->checkWriteTimeout();
	}
}

/**
 * This class represents the HTTP response from a MOXMAN_Http_HttpClient instance.
 *
 * @package MOXMAN_Http
 */
class MOXMAN_Http_HttpClientResponse {
	/** @ignore */
	private $client, $req, $inputStream, $chunkLength, $isEmptyBody, $contentIndex;

	/** @ignore */
	private $version, $code, $message, $headers, $transferEncoding, $contentLength, $contentEncoding;

	/**
	 * Constructs a new http client response instance this is normally done by the HTTP client.
	 *
	 * @param MOXMAN_Http_HttpClient $client HTTP client instance to connect to request.
	 * @param MOXMAN_Http_HttpClientRequest $req HTTP client request instance for the specified response.
	 */
	public function __construct($client, $req, $contentLength = 0) {
		$this->client = $client;
		$this->req = $req;
		$this->inputStream = $client->getInputStream();
		$this->bufferSize = $client->getBufferSize();
		$this->chunkLength = 0;
		$this->contentIndex = 0;

		$this->readHead();
		$this->transferEncoding = strtolower($this->getHeader("transfer-encoding", ""));
		$this->contentEncoding = strtolower($this->getHeader("content-encoding", ""));
		$this->contentLength = $contentLength ? $contentLength : $this->getHeader("content-length", 0);

		$method = $req->getMethod();
		$code = $this->getCode();

		// These requests doesn't have a body
		if ($method == "head" || $code == 204 || $code == 304 || ($method == "connect" && $code >= 200 && $code < 300)) {
			$this->isEmptyBody = true;
		}
	}

	/**
	 * Http version like 1.1.
	 *
	 * @return String Http version string.
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * Returns the HTTP status code like 200 for an valid request.
	 *
	 * @return Int HTTP status code like 200.
	 */
	public function getCode() {
		return $this->code;
	}

	/**
	 * Returns the HTTP status message like OK for an valid request.
	 *
	 * @return Int HTTP status message like OK.
	 */
	public function getMessage() {
		return $this->message;
	}

	/**
	 * Returns the whole HTTP response content body as a string.
	 *
	 * @return String HTTP response content body.
	 */
	public function getBody() {
		$body = "";
		$chunk = "";

		// Read all body contents into a string
		while (($chunk = $this->read())) {
			$body .= $chunk;
		}

		return $body;
	}

	/**
	 * Returns all http headers as an array.
	 *
	 * @return Array name/value array with all HTTP headers.
	 */
	public function getHeaders() {
		return $this->headers;
	}

	/**
	 * Returns a specific header by name if it's not found it will return the specified default value.
	 *
	 * @param string $name Name of the header to retrive.
	 * @param mixed $default Default value to return.
	 * @return mixed Specified header value or default value if it doesn't exist.
	 */
	public function getHeader($name, $default = null) {
		$name = strtolower($name);

		return isset($this->headers[$name]) ? $this->headers[$name] : $default;
	}

	/**
	 * Reads a chunk out of the response body stream and returns the result data.
	 *
	 * @return String Data from response stream or empty string if there is no more data to read.
	 */
	public function read() {
		// For head requests
		if ($this->isEmptyBody) {
			$this->close();
			return "";
		}

		// Currently we don't support any content encodings like gzip or deflate
		// TODO: Implement this if needed
		if ($this->contentEncoding) {
			throw new MOXMAN_Http_HttpClientException("Unsupported content encoding: " . $this->contentEncoding);
		}

		// Read uncompressed chunk
		$data = $this->readChunk();

		// Close connection when there is no more data
		if ($data === "") {
			$this->close();
		}

		return $data;
	}

	/**
	 * Closes the socket if it needs to be closed.
	 */
	private function close() {
		// Close socket connection if keep alive isn't supported
		if (!$this->canKeepAlive()) {
			$this->client->close();
		}
	}

	/**
	 * Reads a chunk out from the response body data stream or returns an empty string if the stream is at the end.
	 *
	 * @private
	 * @return mixed This is the return value description
	 */
	private function readChunk() {
		// Handle content length
		if ($this->contentLength > 0) {
			// End of buffer
			if ($this->contentIndex >= $this->contentLength) {
				return "";
			}

			// Calculate chunk size to read
			$size = $this->contentLength - $this->contentIndex;
			$size = $size < $this->bufferSize ? $size : $this->bufferSize;
			$data = $this->fread($size);

			// Debug chunk size
			if ($this->client->getLogLevel() >= 3) {
				$this->client->log("> Chunk size: " . strlen($data));
			}

			return $data;
		}

		// Handle chunked transfer encoding
		if ($this->transferEncoding === "chunked") {
			if ($this->chunkLength === 0) {
				$line = $this->readLine($this->bufferSize);

				if (!preg_match('/^([0-9a-f]+)/i', $line, $matches)) {
					throw new MOXMAN_Http_HttpClientException("Invalid chunk length: " . $line);
				} else {
					$this->chunkLength = hexdec($matches[1]);

					// Chunk with zero length indicates the end
					if ($this->chunkLength === 0) {
						$this->readLine();
						return '';
					}
				}
			}

			$data = $this->fread(min($this->chunkLength, $this->bufferSize));
			$this->chunkLength -= strlen($data);

			if ($this->chunkLength === 0) {
				$this->readLine(); // Trailing CRLF
			}

			// Debug chunk size
			if ($this->client->getLogLevel() >= 3) {
				$this->client->log("> Chunk size: " . strlen($data));
			}

			return $data;
		}

		return "";
	}

	/**
	 * Reads the header part of the request like the status line and any headers.
	 *
	 * @private
	 */
	private function readHead() {
		$matches = array();

		// Read and parse status line
		$status = $this->readLine();
		if (!preg_match('!^(?:HTTP/(\d\.\d)) (\d{3})(?: (.+))?!', $status, $matches)) {
			throw new MOXMAN_Http_HttpClientException("Malformed status line: " . $status);
		}

		// Debug status line
		if ($this->client->getLogLevel() >= 2) {
			$this->client->log("< " . trim($status));
		}

		$this->version = $matches[1];
		$this->code = intval($matches[2]);
		$this->message = $matches[3];

		// Read and parse headers
		do {
			$line = $this->readLine();

			// Debug header line
			if ($this->client->getLogLevel() >= 2) {
				$this->client->log("< " . trim($line));
			}

			if (preg_match('!^([^\x00-\x1f\x7f-\xff()<>@,;:\\\\"/\[\]?={}\s]+):(.+)$!', $line, $matches)) {
				$name = strtolower($matches[1]);
				$value = trim($matches[2]);

				// Put multiple headers with the same name into an array
				if (isset($this->headers[$name])) {
					if (is_array($this->headers[$name])) {
						$this->headers[$name][] = $value;
					} else {
						$this->headers[$name] = array($this->headers[$name], $value);
					}
				} else {
					$this->headers[$name] = $value;
				}
			}
		} while ($line !== "");
	}

	/**
	 * Reads the specified length out form the socket.
	 *
	 * @private
	 * @param int $length Number of bytes to read.
	 * @return String Data read or empty string at end of stream.
	 */
	private function fread($length) {
		$data = fread($this->inputStream, $length);
		$this->contentIndex += strlen($data);
		$this->checkReadTimeout();

		return $data;
	}

	/**
	 * Reads a single line from socket.
	 *
	 * @private
	 * @return String Single line of data or empty string if the socket is at the end of stream.
	 */
	private function readLine() {
		$line = "";

		while (!feof($this->inputStream)) {
			$line .= fgets($this->inputStream, $this->bufferSize);
			$this->checkReadTimeout();

			if (substr($line, -1) == "\n") {
				return rtrim($line, "\r\n");
			}
		}

		return $line;
	}

	/**
	 * Checks if the last socket read operation timed out if it has then it throws and exception.
	 */
	private function checkReadTimeout() {
		$info = stream_get_meta_data($this->inputStream);

		if (isset($info['timed_out']) && $info['timed_out']) {
			// @codeCoverageIgnoreStart
			throw new MOXMAN_Http_HttpClientException("Request timed out.");
			// @codeCoverageIgnoreEnd
		}
	}

	/**
	 * Returns true/false if the connection can be kept alive or not.
	 *
	 * @private
	 * @return Boolean True/false if the connection can be kept alive or not.
	 */
	private function canKeepAlive() {
		// Get method, version and code
		$method = $this->req->getMethod();
		$version = $this->getVersion();
		$code = $this->getCode();

		// If https connect with a valid http status code
		if ($method == "connect" && $code >= 200 && $code < 300) {
			return true;
		}

		// Check if keep-alive header is set or ommitted but with http 1.1
		if ($version == "1.1" && strtolower($this->getHeader("connection", "keep-alive")) !== "keep-alive") {
			return false;
		}

		// Content length is known or request is head
		if (!($this->transferEncoding == "chunked" || $this->contentLength > 0 || $method == "head" || $code == 204 || $code == 304)) {
			return false;
		}

		// Keep it alive
		return true;
	}
}

/**
 * Contains the data to be sent to forms like multipart data.
 *
 * @package MOXMAN_Http
 */
class MOXMAN_Http_HttpClientFormData {
	/** @ignore */
	private $items;

	/**
	 * Constructs a new http client form data instance.
	 */
	public function __construct() {
		$this->items = array();
	}

	/**
	 * Sets a key/value string item to the client form instance.
	 *
	 * @param string $name Name of the form item to set.
	 * @param string $value Value of the form item.
	 * @return Instance to self for chainability.
	 */
	public function put($name, $value) {
		$this->items[$name] = $value;

		return $this;
	}

	/**
	 * Sets a key/value file item.
	 *
	 * @param string $name Name of the field to set.
	 * @param string $path Local file system path to file to send.
	 * @param string $filename File name to send file as.
	 * @param string $mime Mime type to upload file as.
	 * @return Instance to self for chainability.
	 */
	public function putFile($name, $path, $filename = "", $mime = "application/octet-stream") {
		$this->items[$name] = array($path, $filename ? $filename : basename($path), $mime);

		return $this;
	}

	/**
	 * Returns the items inside the form data.
	 *
	 * @return Array Form items.
	 */
	public function getItems() {
		return $this->items;
	}

	/**
	 * Returns true/false if the object has an file data.
	 *
	 * @return boolean true/false if this instance has file data or not.
	 */
	public function hasFileData() {
		foreach ($this->items as $key => $value) {
			if (is_array($value)) {
				return true;
			}
		}

		return false;
	}
}

/**
 * This exception if thrown by the HttpClient and it's related classes when an error occurs.
 *
 * @package MOXMAN_Http
 */
class MOXMAN_Http_HttpClientException extends Exception {
}

?>