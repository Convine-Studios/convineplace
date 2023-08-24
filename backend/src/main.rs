use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use futures_util::StreamExt; // Add this import for split()
use futures_util::SinkExt; // Add this import for split()
use log::{info, warn};
use env_logger;

#[tokio::main]
async fn main() {
    // Initialize the logger
    env_logger::Builder::new()
        .filter(None, log::LevelFilter::Info)
        .init();

    let listener = TcpListener::bind("127.0.0.1:8080").await.expect("Could not bind");
    info!("Listening on: 127.0.0.1:8080");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(handle_connection(stream));
    }
}

async fn handle_connection(stream: tokio::net::TcpStream) {
    let addr = stream
        .peer_addr()
        .expect("connected streams should have a peer address");
    info!("Peer address: {}", addr);

    let ws_stream = accept_async(stream)
        .await
        .expect("Error during the websocket handshake occurred");

    info!("New WebSocket connection: {}", addr);

    let (mut write, mut read) = ws_stream.split(); // This should work now

    while let Some(message) = read.next().await {
        match message {
            Ok(msg) => {
                if msg.is_binary() || msg.is_text() {
                    write.send(msg).await.expect("Unable to send message");
                }
            }
            Err(e) => {
                warn!("Error processing message: {:?}", e);
            }
        }
    }
}
