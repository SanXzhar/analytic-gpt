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
    st.set_page_config("Analytic-gpt")
    st.header("Analytic-gpt")
    st.subheader("Upload your excel data")
    openai_key = os.getenv("OPENAI_API_KEY")

    raw_table = st.file_uploader(label="upload")

    model = OpenAI(
        model_name="gpt-3.5-turbo-16k",
        openai_api_key=openai_key,
    )

    if raw_table is not None: 
        table = pd.read_excel(raw_table)
        wb = openpyxl.load_workbook(raw_table)
        ws = wb.active
        st.write('Total number of rows: '+str(ws.max_row)+'. And total number of columns: '+str(ws.max_column))

        template = """/
        You are senior data analytic. Analyse following excel file and mention main matrix and trends. Excel file: {table}
        """

        prompt = PromptTemplate.from_template(template)
        st.write(model(prompt.format(table = table)))


    


    # if raw_table is not None:

    #     table = pd.read_excel(raw_table)

    #     template = """/
    #     You are senior data analytic. Analyse following excel file and mention main matrix and trends. Excel file: {table}
    #     """

    #     prompt = PromptTemplate.from_template(template)
    #     st.write(model(prompt.format(table = table)))
        
    

if __name__ == "__main__":
    main()