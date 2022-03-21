import numpy as np
import pandas as pd
import os
import glob

symbol = 'TSLA'
my_dir = os.path.join('./datasets', symbol)
print(my_dir)

all_files = glob.glob(my_dir + "/*/*/*.csv")
li = []

for filename in all_files:
    df = pd.read_csv(filename, index_col=None, header=0)
    #print(filename)
    li.append(df)

frame = pd.concat(li, axis=0, ignore_index=True)
print(frame.shape)

frame = frame.drop_duplicates(subset=['Timestamp'])
print(frame.shape)
frame = frame.sort_values(by=['Timestamp'])
#2018/12/27-2021/02/09總資料量:80820
saved_path = os.path.join( my_dir, f"{symbol}_concat_files.csv" )
frame.to_csv(saved_path)