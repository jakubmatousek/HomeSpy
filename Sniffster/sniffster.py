import nmap
import time
from mac_vendor_lookup import MacLookup
import urllib.parse
import urllib.request
import json

nm = nmap.PortScanner()
knownDevices = []
discTreshold = 15 # treshold v sec, kdy si považuje device za odpojený
serverURL = 'http://localhost:5501'


def scanDevices():
    devices = []
    nm.scan(hosts='192.168.0.0/24', arguments='-sP')
    for ip in nm.all_hosts():
        host = nm[ip]
        mac = "-"
        vendorName = "-"
        if 'mac' in host['addresses']:
            mac = host['addresses']['mac']
            if mac in host['vendor']:
                vendorName = host['vendor'][mac]
        status = host['status']['state']
        rHost = {'ip': ip, 'MAC': mac, 'manufacturer': vendorName,'lastUp': time.time()}
        if mac != "-":
            rHost["manufacturer"] = MacLookup().lookup(mac)
        devices.append(rHost)
    return devices            

#-------MAIN---------#
while(True):
    try:
        connDevices = scanDevices()
        for cDevice in connDevices: # pridavani zar.
            match = False
            for kDevice in knownDevices:
                if(cDevice["MAC"]==kDevice["MAC"]):
                    match = True
            if(match==False):
                data = json.dumps(cDevice).encode('utf8')
                req = urllib.request.Request(serverURL+"/startConnection",data, headers={'content-type': 'application/json'})
                connection = urllib.request.urlopen(req)
                knownDevices.append(cDevice)
                    #send new currently connected req here

        for kDevice in knownDevices:
            match = False
            for cDevice in connDevices:
                if(kDevice["MAC"]==cDevice["MAC"]):
                    match = True
                    kDevice["lastUp"]=time.time()

            discTimer = time.time() - kDevice["lastUp"]
            print("vendor: {1} discTimer:{0} ".format(discTimer,kDevice["manufacturer"]))       
            if(match == False and discTimer > discTreshold):
                data = json.dumps(kDevice).encode('utf8')
                req = urllib.request.Request(serverURL+"/endConnection",data, headers={'content-type': 'application/json'})
                connection = urllib.request.urlopen(req)
                knownDevices.remove(kDevice)           
                #send deisconnect req
        print(len(knownDevices))
    except Exception as e:
        print(e)


