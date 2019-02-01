const {
	ipcRenderer,
	remote
} = require('electron')
const {
	dialog
} = remote
const fs = require("fs")
const child_process = require('child_process');
const pathDir = require('path');

// 获取项目信息
window.projectInfo = ipcRenderer.sendSync('getProjectInfo');

const getDirname = (path) => {
	return pathDir.join(__dirname, path)
}

/**
 * 获取store
 */
window.ipcGetStoreCode = (path) => {
	let con = fs.readFileSync(path, 'utf-8')
	return con
}
/**
 * 保存store代码
 */
window.ipcSaveStoreCode = (obj) => {
	fs.writeFileSync(obj.path, obj.code)
	fs.writeFileSync(obj.root, obj.code)
}

/**
 * 获取api文档
 */
window.ipcGetApiList = () => {
	var c = fs.readFileSync('./src/api/index.js', 'utf8')
	var w = c.split('=')[1]
	// JSON.parse(w.split('let')[0])
	return w.split('let')[0]
}
/**
 * 保存mockApi文档
 */
window.ipcSaveMockApi = (apiList, projectID) => {
	let dataJson = JSON.stringify(apiList, null, 4)
	let con = `
import API from './fetch'

const all = ${dataJson} 

let Apis = {}
all.map(mode => {
  mode.children.map( r => {
    Apis[r.url.split('/')[r.url.split('/').length - 1]] = (params = {}, callback) => {
      API[r.method.toLowerCase()](r.url, params, callback, ${projectID})
    }
  })
})

export default Apis
`
	fs.writeFileSync('./src/api/index.js', con)
}
/**
 * 获取区块代码
 */
window.ipcGetBlockCode = (path) => {
	return fs.readFileSync('./src' + path.substr(1), 'utf-8')
}

/**
 * 保存区块代码
 */
window.ipcSaveBlockCode = (obj) => {
	fs.writeFileSync('./src' + obj.path.substr(1), obj.code)
	fs.writeFileSync(obj.root + '/src' + obj.path.substr(1), obj.code)
}

/**
 * 保存区块信息
 */
window.ipcSaveLayoutBlock = (projectData, callback) => {
	window.ipcSaveLayout(projectData)
	callback()
}
/**
 * 创建区块文件及所在的页面文件夹
 */
window.ipcCreateBlock = (projectData, currentBlock, pageName, blockName, callback) => {

	console.log(projectData)


	let path = './src/blocks/' + pageName
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path)
		let fileCon = fs.readFileSync('./src' + currentBlock.filePath, 'utf8').replace(/mixin\(\)/, 'mixin("' + pageName + '")')
		fs.writeFileSync(path + '/' + blockName + '_' + currentBlock.name + '.vue', fileCon)
		// child_process.spawn('cp', ['./src' + currentBlock.filePath, path + '/' + blockName + '_' + currentBlock.name + '.vue'])
	} else {
		// child_process.spawn('cp', ['./src' + currentBlock.filePath, path + '/' + blockName + '_'+currentBlock.name+'.vue'])
		let fileCon = fs.readFileSync('./src' + currentBlock.filePath, 'utf8').replace(/mixin\(\)/, 'mixin("' + pageName + '")')
		fs.writeFileSync(path + '/' + blockName + '_' + currentBlock.name + '.vue', fileCon)
	}



	// let c = JSON.parse(fs.readFileSync('./src/blocks/config.json', 'utf8'))
	// !c[pageName] && (c[pageName] = {})
	// c[pageName][blockName] = Object.assign({}, currentBlock, { filePath: '/blocks/' + pageName + '/' + blockName + '_' + currentBlock.name + '.vue' })
	// fs.writeFileSync('./src/blocks/config.json', JSON.stringify(c, null, 4))

	// 获取blocks列表
	let blocks = {}
	Object.keys(projectData.layout).map(pageName => {
		const eachData = (data) => {
			Object.keys(data).map(key => {
				if (key.includes('Block')) {
					//记录Block列表
					!blocks[pageName] && (blocks[pageName] = [])
					let o = {}
					o[key] = data[key]
					blocks[pageName].push(o)
				}
				if (typeof data[key] == 'object') {
					eachData(data[key])
				}
			})
		}
		eachData(projectData.layout[pageName])
	})

	console.log('blocks', blocks)

	let importString = ''
	let exportString = ''

	Object.keys(blocks).map(pageName => {
		let s = ''
		blocks[pageName].map((block, index) => {
			importString += `
        import ${pageName}${index} from '${block[Object.keys(block)[0]].filePath}'`
			s += `
        ${Object.keys(block)[0]}: ${pageName}${index},`
		})
		exportString += `
      ${pageName}:{
          ${s}
      },
    `
	})

	// Object.keys(c).map(r => {
	//   let o = {}
	//   let s = ''
	//   Object.keys(c[r]).map(k => {
	//     let k1 = `P${r}${k}`
	//     importString += `
	//             import ${k1} from '@${c[r][k].filePath}'`
	//     s += `
	//                   ${k}: ${k1},`
	//   })
	//   exportString += `
	//           ${r}:{
	//               ${s}
	//           },
	//         `
	// })

	let vueStr = `<script>
          ` + importString + `
          export default {
            ${exportString}
          }
      </script>`;

	// console.log(exportString)



	// fs.writeFileSync(projectData.projectPath + '/src/blocks/config.json', JSON.stringify(c, null, 4))



	// fs.writeFileSync(projectData.projectPath + '/src/blocks/index.vue', vueStr)
	fs.writeFileSync('./src/blocks/index.vue', vueStr)
	// window.ipcSaveLayout(projectData)
	setTimeout(() => {
		callback()

		child_process.spawn('cp', ['-r', './src/blocks', projectData.projectPath + '/src']);

	}, 1000);


}

/**
 * 保存页面布局
 */
window.ipcSaveLayout = (projectData, callback) => {
	fs.writeFileSync('./src/config.json', JSON.stringify(projectData, null, 4))
	fs.writeFileSync(projectData.projectPath + '/src/config.json', JSON.stringify(projectData, null, 4))
	callback && callback()
}
/**
 * 删除项目
 */
window.ipcDelProject = (path, index) => {
	let allProject = JSON.parse(fs.readFileSync('./src/allProject.json', 'utf8'))
	allProject.splice(index, 1)
	fs.writeFileSync('./src/allProject.json', JSON.stringify(allProject, null, 4))
	child_process.spawn('rm', ['-rf', path]);
}
/**
 * 编辑项目
 */
window.ipcOpenProject = (path) => {
	child_process.spawn('cp', ['-r', path + '/src/store/modules', './src/store'])
	child_process.spawn('cp', [path + '/src/api/index.js', './src/api/index.js']);
	child_process.spawn('cp', ['-r', path + '/src/blocks', './src']);
	child_process.spawn('cp', ['-r', path + '/src/page', './src']);
	child_process.spawn('cp', [path + '/src/router/index.js', './src/router/index.js']);
	child_process.spawn('cp', [path + '/src/config.json', './src/config.json']);
	let initInfo = JSON.parse(fs.readFileSync('./src/projectInitInfo.json', 'utf8'))
	initInfo.projectPath = path
	fs.writeFileSync('./src/projectInitInfo.json', JSON.stringify(initInfo, null, 4))
}
/**
 * 运行项目
 */
window.ipcRunProjcet = (path, callback) => {
	const command = `cd ${path};
    yarn install;
    yarn run serve;`
	var proces = child_process.exec(command, {})
	proces.stdout.on('data', function(data) {
		callback('stdout: ' + data);
	});
	proces.stderr.on('data', function(data) {
		callback('stderr: ' + data);
	});

}

/**
 * 判断存在的项目列表
 * @param {} path 
 */
window.ipcProjectList = (projectList) => {
	let pro = []
	projectList.map(project => {
		if (fs.existsSync(project.path) && fs.statSync(project.path).isDirectory()) {
			let existList = fs.readdirSync(project.path) // 读取项目目录下的文件，判断是否有效
			if (existList.includes('package.json') && existList.includes('src')) {
				pro.push(project)
			}
		}
	})
	fs.writeFileSync('./src/allProject.json', JSON.stringify(pro, null, 4))
}
/**
 * 递归删除文件夹
 */
const deleteFolder = (path) => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolder(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

/**
 * 返回项目列表 重置项目初始数据的projectPath路径
 */
window.ipcResetProjectPath = () => {
	let filePath = './src/config.json'
	let projectInfo = JSON.parse(fs.readFileSync(filePath, 'utf8'))

	// 清除Store
	let cmd = child_process.spawn('cp', ['-r', './src/store/modules', projectInfo.projectPath + './src/store'])
	cmd.on('exit', function(code, signal) { // 复制完毕时
		fs.writeFileSync('./src/store/modules/index.js', fs.readFileSync('./web_project/src/store/modules/index.js', 'utf8'))
		fs.readdirSync('./src/store/modules').forEach(function(file) {
			file != 'index.js' && fs.unlinkSync('./src/store/modules/' + file);
		});
	})

	//清除mcokapi
	fs.writeFileSync("./src/api/index.js", '')

	// 清除Blocks文件夹
	fs.readdirSync('./src/blocks').forEach(function(file) {
		var curPath = "./src/blocks/" + file;
		if (fs.statSync(curPath).isDirectory()) { // recurse
			deleteFolder(curPath);
		} else { // delete file
			file != 'config.json' && file != 'index.vue' && fs.unlinkSync(curPath);
		}
	})
	// fs.writeFileSync('./src/blocks/config.json', "{}")
	fs.writeFileSync('./src/blocks/index.vue', "")



	let allProjectList = JSON.parse(fs.readFileSync('./src/allProject.json', 'utf8'))
	// 返回时
	// let filePath = './src/config.json'
	// let projectInfo = JSON.parse(fs.readFileSync(filePath, 'utf8'))
	if (projectInfo.projectPath && projectInfo.systemName) {
		// 读取 projectInfo.projectPath;检查下是否有生成的文件；如果有保存到项目列表，否则不保存
		let existList = fs.readdirSync(projectInfo.projectPath) // 读取项目目录下的文件，判断是否有效
		if (existList.includes('package.json') && existList.includes('src') && !JSON.stringify(allProjectList).includes(projectInfo.projectPath)) {
			allProjectList.push({
				path: projectInfo.projectPath,
				systemName: projectInfo.systemName
			})
			fs.writeFileSync('./src/allProject.json', JSON.stringify(allProjectList, null, 4))
		}
	}

	child_process.spawn('cp', ['-r', './src/layoutBlock', projectInfo.projectPath + '/src'])

	/**
	 * 返回时重置初始数据
	 */
	// 还原projectInitInfo.json数据
	let initData = JSON.parse(fs.readFileSync('./src/projectInitInfo.json', 'utf8'))
	delete initData.projectPath
	fs.writeFileSync('./src/projectInitInfo.json', JSON.stringify(initData, null, 4))
	// 还原projectInitInfo.json数据
	fs.writeFileSync(filePath, '{}')
	// 还原路由
	let routerContent = `
    import Vue from 'vue';
    import Router from 'vue-router';
    Vue.use(Router);
    export default new Router({})
  `
	fs.writeFileSync("./src/router/index.js", routerContent)
	// 还原Page
	deleteFolder("./src/page")
}

/**
 * 创建一个新项目
 * 往初始项目信息里加入新的项目路径
 */
window.ipcCreateProject = () => {
	let path = dialog.showOpenDialog({
		properties: ['openDirectory']
	})
	if (path) {
		let initInfoPath = './src/projectInitInfo.json'
		let projectInfo = JSON.parse(fs.readFileSync(initInfoPath, 'utf8'))
		projectInfo.projectPath = path[0]
		fs.writeFileSync(initInfoPath, JSON.stringify(projectInfo, null, 4))

	}
	return path ? path[0] : ''
}



/**
 * 添加路由文件
 * @param {} page 
 */
let routerFile = '';
let routerPath = [];
let pageNameList = []
const createStore = (directory) => {
	let con = `
  // 跨区块需要的数据及方法在这里定义
  import Api from '@/api/index.js'
  export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {}
  }
`
	directory.map(path => {
		let importStr = ''
		let objStr = ''
		pageNameList.map((file, i) => {
			importStr += `
        import ${file} from "./${file}.js";
      `
			objStr += (i ? ',' : '') + file
			fs.writeFileSync(path + '/' + file + '.js', con)
		})
		fs.writeFileSync(path + '/index.js', `
    ${importStr}
    export default {
      ${objStr}
    }`)
	})
}
const addRouter = (url, path) => {
	let name = url.substr(1).replace(/(^\w)|-(\w)/g, function(a, b, c) {
		return b && b.toUpperCase() || c && c.toUpperCase()
	})
	pageNameList.push(name)
	routerFile += `
    import ${name} from "@${path.substr(5)}"
  `
	routerPath.push(`{path: '${url}', name: '${name}', component: ${name}}`)
}
/**
 * 创建路由文件
 * @param {*} page 
 */
const createRouter = (filePaths) => {
	//routerPath[0].replace(/({path: )(.*),/, "$1'/',")
	routerPath.length && routerPath.unshift(routerPath[0].replace(/(\'\/)(\w{1,})(\'\,)/, '$1$3'))
	let con = `
    import Vue from 'vue';
    import Router from 'vue-router';
    Vue.use(Router);
    ${routerFile}
    export default new Router({
      routes: [${routerPath}]
    })
  `
	filePaths.map(path => {
		fs.writeFile(path, con, function(err) {
			if (!err) {
				console.log("写入成功");
			}
		})
	})

}

// 生成空Vue文件模板
const createEmptyPage = (page) => {
	pageName = page.url.substr(1).replace(/(^\w)|-(\w)/g, function(a, b, c) {
		return b && b.toUpperCase() || c && c.toUpperCase()
	})
	let routerView = `<router-view></router-view>`
	return `
  <template>
    <div class="layout" id="${pageName}">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">${pageName} page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: '${pageName}',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.${pageName}) ? config.layout.${pageName} : '',
          relation:''
        }
      },
      components: {
        layout
      },
      mounted() { },
      watch: { },
      created() { },
      methods: { }
    }
  </script>
`
}

/**
 * 创建page下的目录及文件
 */
const createPageFile = (pageDirectory, pageList) => {
	fs.mkdir(pageDirectory, 0777, function(err) {
		if (!err) {
			let createFile = function(pageList, path) {
				pageList.map(file => {
					!file.children ? fs.mkdir(path + file.url, 0777, function(err) {
						if (!err) {
							// 添加路由文件
							addRouter(file.url, path + file.url + "/index.vue")
							fs.writeFile(path + file.url + "/index.vue", createEmptyPage(file), function(err) {
								if (!err) {
									console.log("写入成功");
								}
							})
						}
					}) : createFile(file.children, path)
				})
			}
			Object.keys(pageList).map(key => {
				createFile(pageList[key], pageDirectory)
			})
		}
	});
}
// 保存并写入项目信息到json文件中 
window.ipcSaveBaseInfo = (projectData, callback) => {

	let menuData = projectData.menuList.menuData;
	if (projectData.template.name == '单页面无模板') {
		menuData = projectData.menuList.menuData = {
			menuLink: [{
				"name": "单页面",
				"url": "/one"
			}]
		}
	}
	// 框架复制web_project项目到projectData.projectPath目录下
	let spawn = child_process.spawn('cp', ['-r', './web_project/', projectData.projectPath]);
	spawn.on('exit', function(code, signal) { // 复制完毕时
		setTimeout(() => {
				fs.writeFileSync("./src/config.json", JSON.stringify(projectData, null, 4))

				let appCon = fs.readFileSync('./src' + projectData.template.file_path, 'utf8').replace(/this\.projectData\ \=\ require\(\'\.\.\/\.\.\/projectInitInfo\.json\'\)/, '');
				fs.writeFileSync(projectData.projectPath + '/src/App.vue', appCon)
				// child_process.spawn('cp', ['./src' + projectData.template.file_path, projectData.projectPath+'/src/App.vue'])
				createPageFile(projectData.projectPath + '/src/page', menuData) // 根据menuData 创建Page文件及其文件
				projectData.api.logout && (projectData.userInfo.userName = '')
				fs.writeFileSync(projectData.projectPath + "/src/config.json", JSON.stringify(projectData, null, 4))
				createRouter([projectData.projectPath + '/src/router/index.js', './src/router/index.js'])
				callback()

				child_process.spawn('cp', ['./src/api/index.js', projectData.projectPath + '/src/api/index.js'])
				createStore(['./src/store/modules', projectData.projectPath + '/src/store/modules'])
		}, 4000);
	});
	createPageFile('./src/page', menuData) // 根据menuData 创建Page文件及其文件
	return true
}