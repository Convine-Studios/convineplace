use std::fs::File;
use std::io::BufReader;
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use tokio_rustls::TlsAcceptor;
use rustls::{ServerConfig, NoClientAuth, internal::pemfile::{pkcs8_private_keys, certs}};
use futures_util::sink::SinkExt;
use futures_util::stream::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Setup server TLS configuration
    let mut config = ServerConfig::new(NoClientAuth::new());
    let cert_file = &mut BufReader::new(File::open("identity.pem").unwrap());
    let key_file = &mut BufReader::new(File::open("identity-key.pem").unwrap());
    let cert_chain = certs(cert_file).unwrap();
    let mut keys = pkcs8_private_keys(key_file).unwrap();
    config.set_single_cert(cert_chain, keys.remove(0)).unwrap();

    let acceptor = TlsAcceptor::from(Arc::new(config));

    // Bind to a TCP address
    let addr = "212.227.78.96:8443";
    let listener = TcpListener::bind(&addr).await?;
    println!("Listening on: {}", addr);

    while let Ok((stream, addr)) = listener.accept().await {
        println!("New TCP connection: {}", addr);

        let acceptor = acceptor.clone();
        tokio::spawn(handle_connection(stream, acceptor));
    }

    Ok(())
}

async fn handle_connection(
    stream: tokio::net::TcpStream,
    acceptor: TlsAcceptor,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr = stream.peer_addr()?;
    let stream = acceptor.accept(stream).await?;
    let ws_stream = accept_async(stream).await?;

    println!("WebSocket handshake successful with {}", addr);

    let (mut write, mut read) = ws_stream.split();

    while let Some(message) = read.next().await {
        match message {
            Ok(msg) => {
                if msg.is_text() || msg.is_binary() {
                    write.send(Message::text("Hello, client!")).await?;
                }
            }
            Err(e) => {
                eprintln!("Error in WebSocket connection: {}", e);
                break;
            }
        }
    }

    Ok(())
}
