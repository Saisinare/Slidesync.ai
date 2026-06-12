import requests

url = "http://localhost:8000/api/upload-ppt"
files = {'file': open('dummy2.pptx', 'rb')}
r = requests.post(url, files=files)
print(r.json())
