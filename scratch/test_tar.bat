ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "tar -tvf ~/backend.tar.gz | head -n 5"
