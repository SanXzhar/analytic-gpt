import io
import pandas as pd
import streamlit as st

def df_info(df):
    df.columns = df.columns.str.replace(' ', '_')
    buffer = io.StringIO() 
    df.info(buf=buffer)
    s = buffer.getvalue() 

    df_info = s.split('\n')

    counts = []
    names = []
    nn_count = []
    dtype = []
    for i in range(5, len(df_info)-3):
        line = df_info[i].split()
        counts.append(line[0])
        names.append(line[1])
        nn_count.append(line[2])
        dtype.append(line[4])

    df_info_dataframe = pd.DataFrame(data = {'#':counts, 'Column':names, 'Non-Null Count':nn_count, 'Data Type':dtype})
    return df_info_dataframe.drop('#', axis = 1)

def df_isnull(df):
    res = pd.DataFrame(df.isnull().sum()).reset_index()
    res['Percentage'] = round(res[0] / df.shape[0] * 100, 2)
    res['Percentage'] = res['Percentage'].astype(str) + '%'
    return res.rename(columns = {'index':'Column', 0:'Number of null values'})

def average(start, end):
    return ("= AVERAGE(" + str(start) + ":" + str(end) + ")")

def counta(start, end):
    return ("=COUNTA(" + str(start) + ":" + str(end) + ")")

def countif(start, end, condition):
    return ("=COUNTIF(" + str(start) + ":" + str(end) + "," + '"' + str(condition) + '"' + ")")

def sum(start, end):
    return ("=SUM(" + str(start) + ":" + str(end) + ")")

def sidebar_space(num_lines=1):
    for _ in range(num_lines):
        st.sidebar.write("")