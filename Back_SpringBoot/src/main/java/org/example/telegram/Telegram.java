package org.example.telegram;

import lombok.extern.slf4j.Slf4j;
//import org.example.config.TelegramConfig;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;


@Slf4j
public class Telegram {
//    private TelegramConfig telegramInfo =new TelegramConfig();
    private String url = "https://api.telegram.org/bot";
    private String botToken = "6821357511:AAErHV5aDPQtUDP4EmvfNCf77T38dB2csf4";
    private String chatId = "-1002125942907";
    URL sendRequest;
    BufferedReader in = null;
    public void sendMessage(String message){
        try {
//            sendRequest = new URL(telegramInfo.getUrl()+telegramInfo.getBotToken()+message+telegramInfo.getChatId());
            sendRequest = new URL(url+botToken+"/sendMessage?chat_id="+chatId+"&text="+message);
            //log.warn(url+botToken+"/sendMessage?chat_id="+chatId+"&text="+message);
            HttpURLConnection connection = (HttpURLConnection)sendRequest.openConnection();
            connection.setRequestMethod("GET");
            log.warn(url+botToken+"/sendMessage?chat_id="+chatId+"&text="+message);
            in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));

        } catch (MalformedURLException e) {
            log.error("telegram Error: "+e.getMessage());
            throw new RuntimeException(e);
        } catch (ProtocolException e) {
            log.error("telegram Error: "+e.getMessage());
            throw new RuntimeException(e);
        } catch (IOException e) {
            log.error("telegram Error: "+e.getMessage());
            throw new RuntimeException(e);
        }finally {
            if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
        }
    }


}
