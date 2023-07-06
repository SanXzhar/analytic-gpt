import pandas as pd
import streamlit as st
import plotly.express as px

st.set_page_config("Analytic-gpt")
st.header("Analytic-gpt")
st.subheader("Upload your excel data")

raw_table = st.file_uploader(label="upload")

if raw_table is not None: 
    table = pd.read_excel(raw_table)
    st.write(table)