class Station:
    def __init__(self, name, lat, lon):
        self.name = name
        self.latitude = lat
        self.longitude = lon
        self.id = None
    
    def __init__(self, name, lat, lon, station_id):
        self.name = name
        self.latitude = lat
        self.longitude = lon
        self.id = station_id

    def getName(self):
        return self.name
    
    def getLatitude(self):
        return self.latitude
    
    def getLongitude(self):
        return self.longitude
    
    def getID(self):
        return self.id
    
    def __str__(self):
        return f"{self.name} at {self.latitude}, {self.longitude}"
