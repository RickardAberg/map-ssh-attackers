auth = open('auth.log')
lines = auth.readline()

for line in auth:
    month = line.split()[0]
    day = line.split()[1]
    time = line.split()[2]
    user = line.split()[3]
    type = line.split()[4]
    if type.startswith("sshd"):
        asd = line.split()[7]
        print month + " " + day + " " + time + " " + asd
        print line.split()

auth.close()