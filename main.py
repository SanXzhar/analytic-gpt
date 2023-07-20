import os
import openpyxl 
import pandas as pd
import streamlit as st
import plotly.express as px
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
# from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain import PromptTemplate
from langchain.llms import OpenAI
from openpyxl.chart import Reference
from functions import *
import functions
import openai
from function_description import *
from langchain.schema import HumanMessage, AIMessage, ChatMessage
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

def main():
    load_dotenv()
    openai_key = os.getenv("OPENAI_API_KEY")
    model = ChatOpenAI(
        model_name="gpt-3.5-turbo-0613",
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


    #info-checker function
    def info():
        st.subheader('Info:')
        c1, c2, c3 = st.columns([1, 6, 1])
        c2.dataframe(functions.df_info(df))
    
    #null-info-checker function
    def null_info():
        st.subheader('Null Info:')
        if df.isnull().sum().sum() == 0:
            st.write("There is not any NA value in your dataset.")
        else:
            c1, c2, c3 = st.columns([1, 6, 1])
            c2.dataframe(functions.df_isnull(df), width = 1500)

    
    #descriptive analysis function
    def descriptive_analysis():
        st.subheader("Descriptive Analysis:")
        st.dataframe(df.describe())

    #target analysis function
    def target_analysis(column):
        st.subheader("Target Analysis:")
        target_column = column
    
        st.subheader("Histogram of target column")
        fig = px.histogram(df, x = target_column)
        c1, c2, c3 = st.columns([0.5, 2, 0.5])
        c2.plotly_chart(fig)

    def mean_value(column):
        mean = df.loc[:, str(column)].mean()
        st.write(mean)        


    #distribution columns builder
    def distribution_columns(column):
        if len(num_columns) == 0:
            st.write('There is no numerical colums in the data.')
        else: 
            selected_num_cols = functions.sidebar_multiselect_container('Choose columns for Distribution plots:', num_columns, "Distribution")
            selected_num_cols.append(column)
            st.subheader("Distribution of numerical colums")
            i = 0
            while (i < len(selected_num_cols)):
                c1, c2 = st.columns(2)
                for j in [c1, c2]:

                    if (i >= len(selected_num_cols)):
                        break

                    fig = px.histogram(df, x = selected_num_cols[i])
                    j.plotly_chart(fig, use_container_width = True)
                    i += 1
    
    #count columns builder
    def count_columns(column_count):
        if len(cat_columns) == 0:
            st.write('There is no categorical column in the data.')
        else:
            selected_cat_cols = functions.sidebar_multiselect_container('Choose colums for count plots:', cat_columns, 'Count')
            selected_cat_cols.append(column_count)
            st.subheader('Count plots of categorical columms')
            i = 0
            while (i < len(selected_cat_cols)):
                c1, c2 = st.columns(2)
                for j in [c1, c2]:

                    if (i >= len(selected_cat_cols)):
                        break

                    fig = px.histogram(df, x = selected_cat_cols[i], color_discrete_sequence=['indianred'])
                    j.plotly_chart(fig)
                    i += 1

    #bar columns builder
    def box_columns(column_box):
        if len(num_columns) == 0:
            st.write('There is no numerical columns in the data.')
        else:
            selected_num_cols = functions.sidebar_multiselect_container('Choose columns for Box plots:', num_columns, 'Box')
            selected_num_cols.append(column_box)
            st.subheader('Box plots')
            i = 0
            while (i < len(selected_num_cols)):
                c1, c2 = st.columns(2)
                for j in [c1, c2]:
                        
                    if (i >= len(selected_num_cols)):
                        break
                        
                    fig = px.box(df, y = selected_num_cols[i])
                    j.plotly_chart(fig, use_container_width = True)
                    i += 1
    
    #outliner-checker
    def oulliner_analysis():
        st.subheader('Outlier Analysis')
        c1, c2, c3 = st.columns([1, 2, 1])
        c2.dataframe(functions.number_of_outliers(df))

    if dataset:
        if file_format == 'csv': 
            df = pd.read_csv(dataset)
        else:
            df = pd.read_excel(dataset)

        template = """/
        You are senior data analytic. Analyse following excel file and mention main matrix and trends. Excel file: {table}
        """
        # human_message_prompt = HumanMessagePromptTemplate.from_template(template)
        # prompt = ChatPromptTemplate.from_messages([human_message_prompt])
        # formatted_prompt = prompt.format_prompt(table=df).to_messages()
        # st.write(model(formatted_prompt))

        user_query = st.text_input(label='')

        first_response = model.predict_messages([HumanMessage(content=user_query)],
                                      functions=function_description)
        st.subheader('Dataframe:')
        n, m = df.shape
        st.write(f'<p style="font-size:130%">Dataset contains {n} rows and {m} columns.</p>', unsafe_allow_html=True)   
        st.dataframe(df)


        chart_types = ['info', 'null_info', 'descriptive_analysis', 'target_analysis', 'distribution_columns', 'count_plot', 'box_plots', 'outlier_analysis']
        
        functions.sidebar_space(3)         
        charts = st.sidebar.multiselect("Choose which visualizations you want to see 👇", chart_types)
        if first_response: 
            function_name = first_response.additional_kwargs["function_call"]["name"]
            if function_name == "target_analysis":
                column = eval(first_response.additional_kwargs['function_call']['arguments']).get('column')
            
            if function_name == "distribution_columns":
                column_dist = eval(first_response.additional_kwargs['function_call']['arguments']).get('column')
                st.write(column_dist)

            if function_name == "count_plot":
                column_count = eval(first_response.additional_kwargs['function_call']['arguments']).get('column')
            
            if function_name == "box_plots":
                column_box = eval(first_response.additional_kwargs['function_call']['arguments']).get('column')
        
            if function_name == "mean_value":
                column_mean = eval(first_response.additional_kwargs['function_call']['arguments']).get('column')


            charts.append(function_name)

        if 'info' in charts:
            info()

        if 'null_info' in charts:
            null_info()

        if 'descriptive_analysis' in charts:
            descriptive_analysis()

        if 'target_analysis' in charts:
            target_analysis(column)

        if 'mean_value' in charts:
            mean_value(column_mean)

        num_columns = df.select_dtypes(exclude = 'object').columns
        cat_columns = df.select_dtypes(include = 'object').columns

        if 'distribution_columns' in charts:
            distribution_columns(column_dist)

        if 'count_plot' in charts:
            count_columns(column_count)
        
        if 'box_plots' in charts:
            box_columns(column_box)           

        if 'outlier_analysis' in charts:
            oulliner_analysis()

if __name__ == "__main__":
    main()
