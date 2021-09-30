import {Stream} from 'stream';
import {ChangeStream} from 'mongodb';

export type ChangeStreamType = Stream & ChangeStream;
