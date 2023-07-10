import os
import openpyxl 
import pandas as pd
import streamlit as st
import plotly.express as px
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain import PromptTemplate
from langchain.llms import OpenAI
from openpyxl.chart import Reference
from functions import *


def main():
    load_dotenv()
    openai_key = os.getenv("OPENAI_API_KEY")
    model = OpenAI(
        model_name="gpt-3.5-turbo-16k",
        openai_api_key=openai_key,
    )
    #streamlit confige
    st.set_page_config("Analytic-gpt")
    st.header("Analytic GPT")
    st.sidebar.header("Tool panel")

    #streamlit file uploading
    st.write('<p style="font-size:130%">Import Dataset</p>', unsafe_allow_html=True)
    file_format = st.radio('Select file format:', ('csv', 'excel'), key='file_format') 
    dataset = st.file_uploader(label = '') 


    if dataset:
        if file_format == 'csv': # format checker
            df = pd.read_csv(dataset)
        else:
            df = pd.read_excel(dataset)
        
        st.subheader('Dataframe:')
        n, m = df.shape
        st.write(f'<p style="font-size:130%">Dataset contains {n} rows and {m} columns.</p>', unsafe_allow_html=True)   
        st.dataframe(df)

        
    

if __name__ == "__main__":
    main()
