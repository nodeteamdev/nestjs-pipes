function delimetedStringObject(n: string[], v: any, d?: string): object {
	n = (<string><unknown>n).split(d || '.');
	n.reverse();
	return n.reduce(function(res, it) {
	  return {[it]: res}
	}, v);
  }

  export default delimetedStringObject