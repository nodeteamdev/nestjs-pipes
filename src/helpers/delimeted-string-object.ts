function delimetedStringObject(n: string[], v: any, d?: string): object {

	n = (<string><unknown>n).split(d || '.');
	n.reverse();
	return n.reduce(function(res, it, c ) {
	if(c === 0) return {[it]: res}
	  return {[it]: {is: res} }
	},v);
  }

  export default delimetedStringObject