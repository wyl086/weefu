# Dockerfile
FROM php:7.2.4-fpm

ENV DEBIAN_FRONTEND=noninteractive

# 在 apt-get update 之前，先修改软件源地址
RUN echo "deb http://archive.debian.org/debian/ stretch main" > /etc/apt/sources.list \
    && echo "deb http://archive.debian.org/debian-security stretch/updates main" >> /etc/apt/sources.list

# 备份原有的 sources.list 文件 (可选，但推荐)
# RUN cp /etc/apt/sources.list /etc/apt/sources.list.bak

# # 将阿里云的归档源写入 sources.list
# RUN cat > /etc/apt/sources.list << EOF \
# deb http://mirrors.aliyun.com/debian-archive/debian/ stretch main \
# deb http://mirrors.aliyun.com/debian-archive/debian-security/ stretch/updates main \
# EOF

# RUN echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian-archive/debian/ stretch main contrib non-free" > /etc/apt/sources.list \
#     && echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian-archive/debian/ stretch-updates main contrib non-free" >> /etc/apt/sources.list \
#     && echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian-archive/debian-security/ stretch/updates main contrib non-free" >> /etc/apt/sources.list


# RUN echo "deb http://mirrors.aliyun.com/debian-archive/debian/ stretch main" > /etc/apt/sources.list \
#     && echo "deb https://mirrors.aliyun.com/debian-archive/debian-security/ stretch/updates main" >> /etc/apt/sources.list

# --- 修改部分 ---
# 将所有系统依赖一次性安装
# 新增: libzip-dev (用于 zip 扩展)
RUN apt-get update && apt-get install -y --allow-unauthenticated --no-install-recommends \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# --- 修改部分 ---
# 安装 PHP 扩展
# 新增: bcmath 和 zip
# 将 gd, pdo, pdo_mysql 放在一起安装
RUN docker-php-ext-install -j$(nproc) pdo pdo_mysql gd bcmath zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg

# --- 新增部分 ---
# 安装并启用 swoole 扩展
# 注意：Swoole v4.5+ 不再支持 PHP 7.1-，v4.8+ 不再支持 PHP 7.2-
# pecl 会自动选择兼容 PHP 7.2 的版本 (例如 4.7.x)
RUN pecl install swoole-4.8.12 \
    && docker-php-ext-enable swoole

# 从官方 Composer 镜像复制 Composer
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

# (可选) 设置 Composer 国内镜像，加快后续依赖安装
RUN composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/

# 设置工作目录
WORKDIR /var/www