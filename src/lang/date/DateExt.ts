
interface Date {
	format(fmt: string): string
}

const ds: { [key: string]: { t: (self) => string, r: RegExp, } } = {
	'M+': { t: (self) => self.getMonth() + 1, r: /(M+)/ },
	'd+': { t: (self) => self.getDate(), r: /(d+)/ },
	'H+': { t: (self) => self.getHours(), r: /(H+)/ },
	'm+': { t: (self) => self.getMinutes(), r: /(m+)/ },
	's+': { t: (self) => self.getSeconds(), r: /(s+)/ },
	'S+': { t: (self) => self.getMilliseconds(), r: /(S+)/ },
};

/**
 * 格式化时间
 * - new Date().Format('yyyy-MM-dd HH:mm:ss');
 */
Date.prototype.format = function (fmt) {
	//因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
	if (/(y+)/.test(fmt)) {
		//第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in ds) {
		let d = ds[k]
		if (d.r.test(fmt)) {
			//第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (d.t(this)) : (('00' + d.t(this)).substr(String(d.t(this)).length)));
		}
	}
	return fmt;
};
