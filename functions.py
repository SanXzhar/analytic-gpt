def average(start, end):
    return ("= AVERAGE(" + str(start) + ":" + str(end) + ")")

def counta(start, end):
    return ("=COUNTA(" + str(start) + ":" + str(end) + ")")

def countif(start, end, condition):
    return ("=COUNTIF(" + str(start) + ":" + str(end) + "," + '"' + str(condition) + '"' + ")")

def sum(start, end):
    return ("=SUM(" + str(start) + ":" + str(end) + ")")

