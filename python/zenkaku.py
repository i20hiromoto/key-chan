import unicodedata

def convert_halfwidth_to_fullwidth_katakana(text):
    result = []
    for char in text:
        # 半角カタカナの場合のみ全角カタカナに変換
        if 'ｦ' <= char <= 'ﾝ' or char in '｡｢｣､･ｰﾞﾟ':
            result.append(unicodedata.normalize('NFKC', char))
        else:
            result.append(char)
    return ''.join(result)

# テスト
halfwidth_text = "ｶﾀｶﾅ"
fullwidth_text = convert_halfwidth_to_fullwidth_katakana(halfwidth_text)
print(fullwidth_text)  # カタカナ