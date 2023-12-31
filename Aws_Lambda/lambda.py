import json
import requests

def lambda_handler(event, context):
    server_url = 'http://ec2-3-38-45-235.ap-northeast-2.compute.amazonaws.com:8080/product/liveTest'
    front_url= 'http://themostfavoriteidoru.s3-website.ap-northeast-2.amazonaws.com'

    try:
        httprequest = requests.get(server_url)
        if httprequest.status_code >= 400: 
            raise ValueError(str(httprequest.status_code))
            
   # http://themostfavoriteidoru.s3-website.ap-northeast-2.amazonaws.com
    #print(httprequest.status_code)
    except ValueError as e:
        BOT_TOKEN = "6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk"
        #server Check : 6865397675:AAHe0Op18dyk2nKtQRGygNkftJT6vLp0YxE
        #Order Check: 6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk
        
        #BOT_CHAT_ID = "360002308"
        
        
        BOT_CHAT_ID = "6923010430"
        #server Check Chat_id: -4033657998
        #OrderCheck Chat_id:6923010430
        bot_message = '20thsServer Error: ' + str(e)
        send_text = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + BOT_CHAT_ID + '&parse_mode=HTML&text=' + bot_message
        response = requests.get(send_text)

    except requests.exceptions.ConnectionError as e:
        BOT_TOKEN = "6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk"
        #server Check : 6865397675:AAHe0Op18dyk2nKtQRGygNkftJT6vLp0YxE
        #Order Check: 6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk
        
        #BOT_CHAT_ID = "360002308"
        
        
        BOT_CHAT_ID = "6923010430"
        #server Check Chat_id: -4033657998
        #OrderCheck Chat_id:6923010430

        error_message=str(e)
        finder = error_message.find('>: ')

        if finder != -1:
            render = error_message[finder:]

        bot_message = '20thsServer Error: '
        send_text = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + BOT_CHAT_ID + '&parse_mode=HTML&text=' + bot_message+render
        response = requests.get(send_text)

    try:
        httprequest = requests.get(front_url)
        if httprequest.status_code >= 400: 
            raise ValueError(str(httprequest.status_code))
            
   # http://themostfavoriteidoru.s3-website.ap-northeast-2.amazonaws.com
    #print(httprequest.status_code)
    except ValueError as e:
        BOT_TOKEN = "6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk"
        #server Check : 6865397675:AAHe0Op18dyk2nKtQRGygNkftJT6vLp0YxE
        #Order Check: 6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk
        
        #BOT_CHAT_ID = "360002308"
        
        
        BOT_CHAT_ID = "6923010430"
        #server Check Chat_id: -4033657998
        #OrderCheck Chat_id:6923010430
        bot_message = '20thsFront Error: ' + str(e)
        send_text = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + BOT_CHAT_ID + '&parse_mode=HTML&text=' + bot_message
        response = requests.get(send_text)

    except requests.exceptions.ConnectionError as e:
        BOT_TOKEN = "6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk"
        #server Check : 6865397675:AAHe0Op18dyk2nKtQRGygNkftJT6vLp0YxE
        #Order Check: 6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk
        
        #BOT_CHAT_ID = "360002308"
        
        
        BOT_CHAT_ID = "6923010430"
        #server Check Chat_id: -4033657998
        #OrderCheck Chat_id:6923010430

        error_message=str(e)
        finder = error_message.find('>: ')

        if finder != -1:
            render = error_message[finder:]

        bot_message = '20thsFront Error: '
        send_text = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + BOT_CHAT_ID + '&parse_mode=HTML&text=' + bot_message+render
        response = requests.get(send_text)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda! ServerMonitor')
    }


result = lambda_handler(None, None)  # event와 context는 None으로 전달
print(result)
